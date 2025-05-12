Modify File Content
===

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor)
[![test](https://github.com/jaywcjlove/github-action-modify-file-content/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/github-action-modify-file-content/actions/workflows/ci.yml)

Replace text content and submit content

Here is the example: update time <!--GAMFC-->2025-05-12 17:15:59<!--GAMFC-END-->

Here is the different delimiter example: <!--GAMFC_TABEL-->different `GAMFC_TABEL` & `GAMFC_TABEL-END` (test)<!--GAMFC_TABEL-END-->

## Inputs

| Name | Required | Default | Description |
| -------- | -------- | -------- | -------- |
| `token`           | ✅        | `${{ github.token }}`                          | GitHub Token used to authenticate API requests. [Why?](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret) |
| `body`            | ✅        | —                                              | The content to insert between delimiters in the target file. |
| `trim_whitespace` | ❌        | `true`                                         | Trim leading and trailing whitespace in `body`. |
| `path`            | ✅        | —                                              | File path to be modified. |
| `branch`          | ❌        | `${{ github.ref_name }}`                       | Branch to commit changes to. |
| `ref`             | ❌        | Default branch (usually `master`)              | The target commit, branch, or tag. |
| `overwrite`       | ❌        | `false`                                        | Whether to overwrite the entire file. |
| `sync_local_file` | ❌        | `true`                                         | Whether to sync the file from the local content. |
| `message`         | ❌        | `doc: update <file path>.`                     | Commit message. |
| `committer_name`  | ❌        | `github-actions[bot]`                          | Name used for the Git commit author. |
| `committer_email` | ❌        | `github-actions[bot]@users.noreply.github.com` | Email used for the Git commit author. |
| `openDelimiter`   | ❌        | `<!--GAMFC-->2025-05-12 17:15:59<!--GAMFC-END-->`                             | End delimiter for content replacement. |

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
update time <!--GAMFC-->2025-05-12 17:15:59<!--GAMFC-END-->
```

Replace the content between `<!--GAMFC-->2025-05-12 17:15:59<!--GAMFC-END-->`.

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

### specify branch changes

```yml
- name: Modify test test/overwrite.file.md
  uses: jaywcjlove/github-action-modify-file-content@main
  with:
    branch: test
    path: test/overwrite.file.md
    body: "{{date:YYYY-MM-DD HH:mm:ss}}"
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
- [Github Action Read File Content](https://github.com/jaywcjlove/github-action-read-file) 
Read file contents. You can also get the file content in the branch.

## Contributors

As always, thanks to our amazing contributors!

<!--CONTRIBUTING-->

<a href="https://github.com/jaywcjlove" title="小弟调调"><img src="https://avatars.githubusercontent.com/u/1680273?v=4" width="24;" alt="小弟调调"/></a>


<!--CONTRIBUTING-END-->

## License

Licensed under the MIT License.
