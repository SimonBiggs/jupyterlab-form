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
  While rendering your form an error occured.
</p>
<p>
  The error from the Angular compiler is printed below:
</p>
<pre style="white-space: pre-wrap;">
  ` + error + '</pre>';
   }

   // delegate to the default handler
   super.handleError(error);
  }
}
