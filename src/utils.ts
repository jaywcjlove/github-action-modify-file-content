import FS from 'fs-extra';
import path from 'path';
import { context, getOctokit } from '@actions/github';
import { getInput, setOutput, startGroup, info, endGroup, warning } from '@actions/core';
import { paths, components,  } from '@octokit/openapi-types';
import { OctokitResponse } from '@octokit/types';

export type FilePutQuery = paths['/repos/{owner}/{repo}/contents/{path}']['put']['requestBody']['content']['application/json'] & paths['/repos/{owner}/{repo}/contents/{path}']['put']['parameters']['path'];

export const myToken = getInput('token');
export const octokit = getOctokit(myToken);

export const getInputs = () => {
  const body = getInput('body') || '';
  const ref = getInput('ref') || context.ref;
  const branch = getInput('branch');
  const sha = getInput('sha');
  const overwrite = getInput('overwrite') || 'false';
  const sync_local_file = getInput('sync_local_file') || 'true';
  const filepath = getInput('path') || '';
  const message = getInput('message') || '';
  const committer_name = getInput('committer_name') || '';
  const committer_email = getInput('committer_email') || '';
  const openDelimiter = getInput('openDelimiter') || '<!--GAMFC-->';
  const closeDelimiter = getInput('closeDelimiter') || '<!--GAMFC-END-->';
  
  return {
    ...context.repo,
    body, filepath, ref, branch, sha,
    message,
    committer_name,
    committer_email,
    openDelimiter,
    closeDelimiter,
    overwrite,
    sync_local_file
  }
}

export async function getReposPathContents(filePath: string, options: { ref?: string; } = {}) {
  const {owner, repo, ref} = getInputs()
  const result = await octokit.rest.repos.getContent({
    owner, repo,
    path: filePath,
    /**
     * The name of the commit/branch/tag. Default: the repository’s default branch (usually `master`)
     */
    ref: options.ref || ref,
  })
  return result
}

async function getBranch(): Promise<string> {
  const { branch } = getInputs()
  if (branch !== null) {
    return Promise.resolve(branch);
  }
  const { data } = await octokit.rest.repos.get(context.repo);
  return data.default_branch;
}

export async function createCommit(newTreeSha: string, baseCommitSha: string) {
  const {owner, message, repo, committer_name, committer_email} = getInputs()
  
  const { data } = await octokit.rest.git.createCommit({
    owner, repo, message,
    tree: newTreeSha,
    parents: [baseCommitSha],
    author: {
      name: committer_name,
      email: committer_email
    }
  })
  return data.sha;
}

export async function modifyPathContents(options: Partial<FilePutQuery> = {}, content: string) {
  const { ...other} = options;
  const { owner, repo, openDelimiter, closeDelimiter, message, committer_name, committer_email, overwrite, sync_local_file, ref, sha} = getInputs();
  const branch = await getBranch();
  if (!options.path) {
    throw new Error(`modifyPathContents: file directory parameter does not exist`)
  }
  const fullPath = path.resolve(options.path);
  const isExists = FS.existsSync(fullPath)
  info(`👉 Modify Path (${options.path})`)
  info(`👉 Context.ref: (${context.ref})`);
  info(`👉 Context.sha: (${context.sha})`);
  info(`👉 Context.sha: (${context.sha})`);
  const body: FilePutQuery = {
    owner, repo,
    path: options.path,
    message: message || `doc: ${isExists ? 'modify' : 'create'} ${options.path}.`,
    committer: {
      name: committer_name || 'github-actions[bot]',
      email: committer_email || 'github-actions[bot]@users.noreply.github.com'
    },
    ...other,
    content: Buffer.from(content).toString("base64"),
  }
  if (branch) {
    body.branch = branch;
    const bh = await octokit.rest.repos.getBranch({ owner, repo, branch })
    body.sha = branch || bh.data.commit.sha;
    startGroup(`👉 Branch content: ${bh.data.commit.commit.message} ${bh.data.commit.commit.author?.name}`);
      info(`👉 body.sha: (${branch}) (${body.sha})`);
      info(`👉 ${JSON.stringify(bh, null, 2)}`);
    endGroup();
  } else if (!branch && sha) {
    body.sha = sha;
  }
  if (isExists) {
    info(`👉 body.sha: (${branch}) (${body.sha})`);
    const fileResult = await getReposPathContents(options.path, { ref: body.branch || body.sha });
    if (fileResult.status === 200 && (fileResult.data as any).sha) {
      if (!branch) {
        body.sha = (fileResult.data as any).sha || sha;
      }
      const fileContent: string = (fileResult.data as any).content || '';
      const oldFileContent = Buffer.from(fileContent, 'base64').toString();
      const REG = new RegExp(`${openDelimiter}([\\s\\S]*?)${closeDelimiter}`, 'ig')
      const reuslt = oldFileContent.replace(REG, `${openDelimiter}${content}${closeDelimiter}`);
      const match = oldFileContent.match(REG);
      startGroup(`👉 Text old content: ${match?.length} ${options.path}`);
        info(`👉 ${oldFileContent}`);
        info(`👉 ${JSON.stringify(match, null, 2)}`);
      endGroup();
      startGroup(`👉 Text new content: ${options.path}`);
        info(`👉 ${JSON.stringify(fileResult.data, null, 2)}`);
        info(`👉 ${reuslt}`);
      endGroup();
      setOutput('content', reuslt);
      if (oldFileContent == reuslt) {
        warning(`👉 Content has not changed!!!!!`)
        return;
      }
      let new_content = Buffer.from(content).toString("base64")
      if (overwrite.toString() === 'true') {
        body.content = new_content;
      } else {
        body.content = Buffer.from(reuslt).toString("base64");
        new_content = reuslt;
      }
      if (sync_local_file.toString() === 'true' && ref === context.ref) {
        await FS.writeFile(fullPath, new_content);
      }
    }
  }
  startGroup(`modifyPathContents Body:`)
    info(`👉 ${JSON.stringify(body, null, 2)}`)
  endGroup()
  return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
    ...body,
  });
}

export type IssuesData = components["schemas"]["issue"][];
export type Response = OctokitResponse<IssuesData, 200>
