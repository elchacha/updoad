import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import uploadFilesWithStatut from '@salesforce/apex/FileUploader.uploadFilesWithStatut'
import getFileInfo from '@salesforce/apex/FileUploader.getFileInfo';
import deleteFile from '@salesforce/apex/FileUploader.deleteFile';



function readAsDataURL(file) {
    return new Promise((resolve, reject)=>{
        let fileReader = new FileReader();
        fileReader.onload = function(){
            return resolve({data:fileReader.result, filename:file.name, size: file.size, type: file.type});
        }
        fileReader.readAsDataURL(file);
    })
} 

const columns = [
    {label : 'Fichier', fieldName : 'Title', sortable: false ,hideDefaultActions: true},
    {label : 'Extension', fieldName : 'FileExtension', sortable: false ,fixedWidth:80,hideDefaultActions: true},
    {label : 'Taille', fieldName : 'ContentSize', sortable: false  ,fixedWidth:80,hideDefaultActions: true},
];

export default class FileUploaderCompLwc extends LightningModal {

    @api content;
    @api description ;

    columnsList = columns ;
    dataTbl =[];

    docSelected;    
    Loading=false;

    connectedCallback() {
        this.idsViewShared=this.content.idsViewShared;
        this.idsViewShared=this.content.idsInferredShare;
    }


    afficheLWC(cvIds) {
        this.Loading=true;
        getFileInfo({ cvIds })
            .then(result => {
            this.dataTbl = result;
            this.error = undefined;
            this.Loading=false;
        }) 
        .catch(error => {
            console.log('error ',JSON.stringify(error));
            this.Loading=false;
        });
    }
    

    async openfileUpload(event) {
		let files = [...event.target.files];
		let images = await Promise.all(files.map(f=>{return readAsDataURL(f)}));
        let result = await Promise.all(images.map(f=>{return this.uploadFilePromise(f)}));
        this.dataTbl.forEach(contentVersion => result.push(contentVersion.Id));
        this.afficheLWC(result) ;
    }

    uploadFilePromise(file) {
        const {data, filename} =file
        const base64= data.replace('data:', '').replace(/^.+,/, '');
        
        return  uploadFilesWithStatut({ base64, filename, idsViewShared : this.idsViewShared,idsInferredShare : this.idsInferredShare,status:'EN_VALID' });
    } 

    handleRowClick(event){
        this.docSelected=event.detail.pk;
    }


    removeDoc(){
        deleteFile({cvId : this.docSelected}).then(() => {
            this.dataTbl = this.dataTbl.filter(contentVersion => contentVersion.Id!=this.docSelected);
            this.error = undefined;
            this.docSelected=null;
        }) 
        .catch(error => {
            console.log('error ',JSON.stringify(error));
        });
        console.log('about to delete cv with id  : '+this.docSelected);
    }



    closeModal(){
        this.close();
    }




}