import { h, render } from 'preact';
import { UtilService } from './services/my-date-picker.util.service';
import { LocaleService } from './services/my-date-picker.locale.service';
import { MyDatePicker, MyDateProps } from './myDatePicker';

let styles = require('../src/css/style.css');

let dateOptions = {} as MyDateProps;
dateOptions.localeService = new LocaleService();
dateOptions.utilService = new UtilService();
dateOptions.locale = 'en';
dateOptions.options = {};
dateOptions.disabled = false;
dateOptions.placeholder = 'select date';


render(<MyDatePicker {...dateOptions} />, document.querySelector('#app'));
