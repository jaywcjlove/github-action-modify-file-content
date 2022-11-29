Modify File Content
===

Replace text content and submit content

Here is the example: update time <!--GAMFC-->2022-11-29 05:49:16<!--GAMFC-END-->

Here is the different delimiter example: <!--GAMFC_TABEL-->different `GAMFC_TABEL` & `GAMFC_TABEL-END` (test)<!--GAMFC_TABEL-END-->

## Inputs

- `token` Your `GITHUB_TOKEN`. This is required. Why do we need `token`? Read more here: [About the GITHUB_TOKEN secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret). Default: `${{ github.token }}`
- `body` what needs to be replaced
- `path` file to be replaced
- `sha` The blob SHA of the file being replaced
- `branch` The person that committed the file. Default: the authenticated user
- `ref` The name of the commit/branch/tag. Default: the repository’s default branch (usually `master`)
- `overwrite` Overwrite the entire file content, by default `false`
- `sync_local_file` Sync local file content, by default `true`
- `message` The commit message. by default `doc: update <file path>.`
- `committer_name` The name of the author or committer of the commit. by default `github-actions[bot]`
- `committer_email` The email of the author or committer of the commit. by default `github-actions[bot]@users.noreply.github.com`
- `openDelimiter` Character to use for opening delimiter, by default "<\!--GAMFC-->"
- `closeDelimiter` Character to use for closing delimiter, by default "<\!--GAMFC-END-->"

## Outputs

- `content` text file content

## Example Usage

```yml
- name: Modify README.md
  uses: jaywcjlove/github-action-modify-file-content@main
  with:
    path: README.md
```

`README.md` file content

```markdown
update time <!--GAMFC-->2022-11-29 05:49:16<!--GAMFC-END-->
```

Replace the content between `<!--GAMFC-->2022-11-29 05:49:16<!--GAMFC-END-->`.

### format date

```yml
- name: Modify README.md
  uses: jaywcjlove/github-action-modify-file-content@main
  with:
    path: README.md
    body: "{{date:YYYY-MM-DD HH:mm:ss}}"
```

### overwrite file

```yml
- name: Modify README.md
  uses: jaywcjlove/github-action-modify-file-content@main
  with:
    path: README.md
    body: "overwrite file content {{date:YYYY-MM-DD HH:mm:ss}}",
    overwrite: 'true'
```

## See Also

- [Github Release Changelog Generator](https://github.com/jaywcjlove/changelog-generator) A GitHub Action that compares the commit differences between two branches
- [Create Tags From](https://github.com/jaywcjlove/create-tag-action) Auto create tags from commit or package.json.
- [Github Action Contributors](https://github.com/jaywcjlove/github-action-contributors) Github action generates dynamic image URL for contributor list to display it!
- [Generated Badges](https://github.com/jaywcjlove/generated-badges) Create a badge using GitHub Actions and GitHub Workflow CPU time (no 3rd parties servers)
- [Create Coverage Badges](https://github.com/jaywcjlove/coverage-badges-cli) Create coverage badges from coverage reports. (no 3rd parties servers)
- [Github Action package](https://github.com/jaywcjlove/github-action-package) Read and modify the contents of `package.json`.
- [Github Action EJS](https://github.com/jaywcjlove/github-action-package) A github action to render a ejs template using github context.

## License

Licensed under the MIT License.
