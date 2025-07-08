window.DocRaptor = {
  // Creates an HTML form with doc_attrs set, submits it. If successful
  // this will force the browser to download a file. On failure it shows
  // the DocRaptor error directly.
  createAndDownloadDoc: function(api_key, doc_attrs) {
    const makeFormElement = function(name, value) {
      const element = document.createElement('textarea');
      element.name = name;
      element.value = value;
      return element;
    };

    const form = document.createElement('form');
    form.action = 'https://docraptor.com/docs';
    form.method = 'post';
    form.style.display = 'none';

    form.appendChild(makeFormElement('user_credentials', api_key));

    for (const key in doc_attrs) {
      if (key == 'prince_options') {
        for (const option in doc_attrs.prince_options) {
          form.appendChild(makeFormElement('doc[prince_options][' + option + ']', doc_attrs.prince_options[option]));
        }
      } else {
        form.appendChild(makeFormElement('doc[' + key + ']', doc_attrs[key]));
      }
    }

    document.body.appendChild(form);
    form.submit();
  }
};
