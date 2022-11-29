import FS from 'fs-extra';
import path from 'path';
import { context, getOctokit } from '@actions/github';
import { getInput, setOutput, startGroup, info, endGroup, warning } from '@actions/core';
import { paths } from '@octokit/openapi-types';

export type FilePutQuery = paths['/repos/{owner}/{repo}/contents/{path}']['put']['requestBody']['content']['application/json'] & paths['/repos/{owner}/{repo}/contents/{path}']['put']['parameters']['path'];
export type FilePutResult = paths['/repos/{owner}/{repo}/contents/{path}']['get']['responses']['200']['content']['application/json']

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

interface RefInfo {
	treeSha: string;
	commitSha: string;
}

async function getFileContents(branch: string) {
  const {owner, repo, filepath, committer_name, committer_email} = getInputs()
  const data = await octokit.rest.repos.getContent({
    owner, repo, ref: branch, path: filepath
  })
  return data;
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
  info(`👉 branch: (${branch})`);
  let body: FilePutQuery = {
    owner, repo,
    path: options.path,
    message: message || `doc: update ${options.path}.`,
    committer: {
      name: committer_name || 'github-actions[bot]',
      email: committer_email || 'github-actions[bot]@users.noreply.github.com'
    },
    ...other,
    content: Buffer.from(content).toString("base64"),
  }

  const currentFile = await getFileContents(branch);
  if (currentFile.status === 200) {
    const fileContent: string = (currentFile.data as any).content || '';
    const oldFileContent = Buffer.from(fileContent, 'base64').toString();
    const REG = new RegExp(`${openDelimiter}([\\s\\S]*?)${closeDelimiter}`, 'ig')
    const reuslt = oldFileContent.replace(REG, `${openDelimiter}${content}${closeDelimiter}`);
    const match = oldFileContent.match(REG);
    startGroup(`👉 Text old content: ${match?.length} ${options.path}`);
      info(`👉 ${oldFileContent}`);
      info(`👉 ${JSON.stringify(match, null, 2)}`);
    endGroup();
    startGroup(`👉 Text new content: ${options.path}`);
      info(`👉 ${JSON.stringify(currentFile.data, null, 2)}`);
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
    body = { ...body, ...currentFile.data, sha: (currentFile.data as any).sha }
    startGroup(`modifyPathContents Body:`)
      info(`👉 ${JSON.stringify(body, null, 2)}`)
    endGroup()
    const result = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      ...currentFile.data,
      ...body,
      sha: (currentFile.data as any).sha
    });
    startGroup(`file result:`)
      info(`👉 ${result.data.content?.path}`)
      info(`👉 ${result.data.content?.size}`)
      info(`👉 ${result.data.content?.sha}`)
    endGroup()
  } else {
    startGroup(`result error:`)
      info(`👉 ${currentFile.status}`)
      info(`👉 ${JSON.stringify(currentFile.data, null, 2)}`)
    endGroup()
  }
}