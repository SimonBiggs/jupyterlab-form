/*
Handler to print error messages at the top of the form.

If the user makes an error within the form template at least the user will be
presented with some form of error message.

In the future the display of this message could integrate better with
jupyterlab.
*/

import { ErrorHandler } from '@angular/core';

export class AppErrorHandler extends ErrorHandler {

  handleError(error: any) {
   const errorbox = document.getElementsByClassName('errorbox');
   if (errorbox.length > 0) {
    errorbox[0].innerHTML = `<h2>Error</h2>
<p>
  You appear to have typed your form incorrectly. Fix your form template and
  try pressing \`Ctrl + Enter\` again.
</p>
<p>
  If it is helpful to you the Angular Compiler error is printed below:
</p>
<pre style="white-space: pre-wrap;">
  ` + error + '</pre>';
   }

  //  console.log('Hello')

   // delegate to the default handler
   super.handleError(error);
  }
}
