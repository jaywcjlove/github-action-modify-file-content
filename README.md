Modify File Content
===

Replace text content and submit content

update time <!--GAMFC-->what needs to be replaced1<!--GAMFC-END-->

## Example Usage

```yml
- name: Modify README.md
  uses: github-action-modify-file-content@main
  with:
    filepath: README.md
    date: 
```

`README.md` file content

```markdown
update time <!--GAMFC-->what needs to be replaced<!--GAMFC-END-->
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
