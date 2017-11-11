/*
Import the required styles.
*/

import './style.css';
import '../angular-app/theme.css';

/*
This currently loads up the material design icons via the web. The later
versions of angular material allow for these icons to be included in the
bundle. Once I upgrade angular material this part will no longer be required.
*/
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
link.setAttribute('async', '');
document.head.appendChild(link);
