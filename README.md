Modify File Content
===

Replace text content and submit content

Here is the example: update time <!--GAMFC-->2022-10-26 14:51:48<!--GAMFC-END-->

## Inputs

- `token` Your `GITHUB_TOKEN`. This is required. Why do we need `token`? Read more here: [About the GITHUB_TOKEN secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret). Default: `${{ github.token }}`
- `body` what needs to be replaced
- `path` file to be replaced
- `openDelimiter` Character to use for opening delimiter, by default `<!--GAMFC-->`
- `closeDelimiter` Character to use for closing delimiter, by default `<!--GAMFC-END-->`

## Outputs

- `content` text file content

## Example Usage

```yml
- name: Modify README.md
  uses: github-action-modify-file-content@main
  with:
    filepath: README.md
```

`README.md` file content

```markdown
update time <!--GAMFC-->2022-10-26 14:51:48<!--GAMFC-END-->
```

Replace the content between `<!--GAMFC-->` and 
`<!--GAMFC-END-->`.

### format date

```yml
- name: Modify README.md
  uses: github-action-modify-file-content@main
  with:
    filepath: README.md
    body: "{{date:YYYY-MM-DD HH:mm:ss}}"
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
