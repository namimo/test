export const twoStepHTML = (key: string) => `
<div style="
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    background: #f9f9f9;
">
<div style="
    box-sizing: border-box;
    background: #fff;
    max-width: 600px;
    margin-right: auto;
    margin-left: auto;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12) !important;
    border-radius: 5px;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
    border-top: 4.5px solid #000;
    text-align: center;
    font-family: 'AvenirNextLTPro-Medium','Avenir Next','HelveticaNeueMedium','HelveticaNeue-Medium','Helvetica Neue Medium','HelveticaNeue','Helvetica Neue','Avenir',Helvetica,Arial,sans-serif;
">
<div style="padding: 40px 30px 30px 30px;">
<h1 style="color: #363c43;line-height: 125%;font-family: 'AvenirNextLTPro-Medium','Avenir Next','HelveticaNeueMedium','HelveticaNeue-Medium','Helvetica Neue Medium','HelveticaNeue','Helvetica Neue','Avenir',Helvetica,Arial,sans-serif;font-size: 30px;font-weight: 500;margin-top: 0;margin-bottom: 20px;">Rewise Login ID</h1>
   <div style="
    font-size: 15px;
    color: #6B7080;
    line-height: 135%;
">
<p style="
    margin: 0;
">Welcome back!</p>
<p style="
    margin-top: 0;
    margin-bottom: 35px;
">Use the verification code below to log in.</p><div style="
    display: inline;
    font-size: 16px;
    padding: 10px 20px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 2px;
">${key.slice(0, 3) + ' ' + key.slice(3)}</div>
</div>
</div><hr style="border: 0;height: 0;border-top: 1px solid rgba(0, 0, 0, 0.1);border-bottom: 1px solid rgba(255, 255, 255, 0.3);width: 95%;">

<div style="
    font-size: 12px;
    color: #6b7075;
    line-height: 135%;
    padding: 10px 25px;
">
You received this email cause you have enabled two-step authentication. If you didn't request to log in, you can safely ignore this email.
</div>
<div style="
    padding: 15px 30px;
">
<p style="margin: 0;
">&#169; Copyright 2019-${new Date().getFullYear()} | <a href="https://codepen.io/pen/">BAKA</a></p>
</div>
</div>
</div>
`;
