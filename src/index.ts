import { getInput, setFailed, info } from '@actions/core';
import { modifyPathContents } from './utils';
import formatter from '@uiw/formatter';

const REGEXP = /\{\{date:?(.*?)\}\}/ig

;(async () => {
  try {
    let body = getInput('body') || '';
    const filepath = getInput('path') || '';
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

    await modifyPathContents({ path: filepath }, body);
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    }
  }
})();
