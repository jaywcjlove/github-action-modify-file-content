import { getInput, startGroup, endGroup, setFailed, info, warning } from '@actions/core';
import formatter from '@uiw/formatter';
import { modifyPathContents } from './utils';

const REGEXP = /\{\{date:?(.*?)\}\}/ig

;(async () => {
  const filepath = getInput('path') || '';
  try {
    let body = getInput('body') || '';
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

    startGroup(`👉 Body input content:`);
    info(body)
    endGroup();

    await modifyPathContents({ path: filepath }, body);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(`${error.message} - ${filepath}`);
    }
  }
})();
