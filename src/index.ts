import { getInput, setFailed, info, warning, startGroup, endGroup } from '@actions/core';
import { modifyPathContents } from './utils';
import formatter from '@uiw/formatter';

const REGEXP = /\{\{date:?(.*?)\}\}/ig

;(async () => {
  try {
    let body = getInput('body') || '';
    const filepath = getInput('path') || '';
    if (!body) {
      warning(`👉 "body" input value does not exist.`)
      return
    }
    if (!filepath) {
      warning(`👉 "path" input value does not exist.`)
      return
    }
    if (REGEXP.test(body)) {
      const result = body.replace(REGEXP, (match, str2) => {
        const format = match.replace(REGEXP, '$1');
        const str = formatter(format || 'YYYY/MM/DD HH:mm:ss', new Date());
        return str
      });

      if (result) {
        body = result
      }
    }
    info(`👉 Body Content: ${body}`)

    const result = await modifyPathContents({ path: filepath }, body);
    if (!result) {
      return
    }
    result.data.content?.size

    startGroup(`file result:`)
      info(`👉 ${result.data.content?.path}`)
      info(`👉 ${result.data.content?.size}`)
      info(`👉 ${result.data.content?.sha}`)
    endGroup()
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
})();
