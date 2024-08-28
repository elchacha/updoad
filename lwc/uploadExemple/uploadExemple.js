import { LightningElement } from 'lwc';

import getFileExemple from '@salesforce/apex/FileUploaderExemple.getFileExemple';


export default class UploadExemple extends LightningElement {
    idsViewShared=['a05KI000000MqeYYAS','003KI000001fG4XYAU'];
    idsInferredShare=['a0BKI000000GxsW2AS'];

    documentFiles=[];

    connectedCallback(){
        this.loadFiles();
    }


    loadFiles(){
        console.log('should load files');
        getFileExemple()
        .then(result => {
            console.log('result',result);
            this.documentFiles = result;
            this.error = undefined;
        }) 
        .catch(error => {
            alert(JSON.stringify(error));
            console.log('afficher error ');
        });
    }
}