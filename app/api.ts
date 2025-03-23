import { API } from 'ynab';
import { addListener } from '~/auth';

let instance: API = new API('');

addListener(({ accessToken }) => {
  instance = new API(accessToken);
});

export default function api() {
  return instance;
}
