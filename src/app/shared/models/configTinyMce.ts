import firebase from 'firebase/compat/app';
import { uniqueId } from 'lodash';

export const configTinyMce = {
  height: 300,
  menubar: true,
  language: 'es',
  image_advtab: true,
  default_link_target: '_blank',
  //  skin_url: '../../../assets/tinymce/skins/lightgray',
  images_upload_handler: async function (blobInfo, success, failure) {
    let stringPath = `galeria/${uniqueId('img')}${blobInfo.filename()}`;
    var storage = firebase.storage();
    /// ref(stringPath).put(blobInfo.blob()).then;
    try {
      const ref = storage.ref(stringPath);
      await ref.put(blobInfo.blob());
      const url = await ref.getDownloadURL();
      success(url);
    } catch (error) {
      console.warn(error);
      failure(null);
    }
  },
  imagetools_toolbar:
    'rotateleft rotateright | flipv fliph | editimage imageoptions',
  menu: {
    file: { title: 'File', items: 'preview | print ' },
    edit: {
      title: 'Edit',
      items: 'undo redo | cut copy paste | selectall | searchreplace',
    },
    view: {
      title: 'View',
      items:
        'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen',
    },
    insert: {
      title: 'Insert',
      items:
        'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime',
    },
    format: {
      title: 'Format',
      items:
        'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat',
    },
    tools: {
      title: 'Tools',
      items: 'spellchecker spellcheckerlanguage | code wordcount',
    },
    table: {
      title: 'Table',
      items: 'inserttable | cell row column | tableprops deletetable',
    },
    help: { title: 'Help', items: 'help' },
  },
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'visualchars',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount',
  ],
  toolbar:
    'undo redo | formatselect | bold italic backcolor | \
       alignleft aligncenter alignright alignjustify | \
       bullist numlist outdent indent | removeformat | help | table | image | link | media',
};
