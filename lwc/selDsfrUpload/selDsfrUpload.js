import { LightningElement,api } from 'lwc';

import { loadStyle } from 'lightning/platformResourceLoader';
import DSFR_RSC from '@salesforce/resourceUrl/dsfr';
import DSFR_SLDS_RSC from '@salesforce/resourceUrl/dsfrSlds';
import FileUploaderLwr from 'c/fileUploaderLwr';


export default class SelDsfrUpload extends LightningElement {

    @api documentFiles;
    @api title='Send a Title';
    @api description = 'purpose of the component';
    @api idsViewShared=['a05KI000000MqeYYAS','003KI000001fG4XYAU'];
    @api idsInferredShare=['a0BKI000000GxsW2AS'];

    @api
    get badge() {
      return 'should not be read';
    }
  
    set badge(value) {
        switch(value) {
            case 'OPTIONNEL':
                this.badgeCss= 'fr-badge fr-badge--grey';
                this.badgeTitle='OPTIONNEL';
                break;  
            case 'VALIDATION':
                this.badgeCss= 'fr-badge fr-badge--info';  
                this.badgeTitle='VALIDATION';
                break;  
            case 'VALIDEE':
                this.badgeCss= 'fr-badge fr-badge--success';  
                this.badgeTitle='VALIDEE';
                break;  
            case 'ADEPOSE':
                this.badgeCss= 'fr-badge fr-badge--warning';  
                this.badgeTitle='A DEPOSE';
                break;  
            case 'REFUSER':
                this.badgeCss= 'fr-badge fr-badge--error';  
                this.badgeTitle='REFUSER';
                break;  
            default:
                this.badgeTitle='Badge value not recognized';
                break;
          }
    }

    badgeCss;
    badgeTitle;



    connectedCallback() {
        Promise.all([
            loadStyle(this, DSFR_RSC + '/dsfr.min.css'),
            loadStyle(this, DSFR_RSC + '/utility/utility.min.css'),
            loadStyle(this, DSFR_SLDS_RSC)
        ]);
    }

    async handleAdd(){
        const result = await FileUploaderLwr.open({
            size: 'small',
            description: this.description,
            content : {idsViewShared:this.idsViewShared,idsInferredShare:this.idsInferredShare}
        })
		this.dispatchEvent(new CustomEvent( 'filesuploaded' , {detail: {info: 'file uploaded'}}));
    }


    getBadgeClass(){
        switch(this.badge) {
            case 'validée':
              return 'fr-badge fr-badge--grey';  
            case 'validée':
                return 'fr-badge fr-badge--info';  
            case 'validée':
                return 'fr-badge fr-badge--success';  
            case 'validée':
                return 'fr-badge fr-badge--warning';  
            case 'validée':
                return 'fr-badge fr-badge--error';  
            default:
              // code block
          }
    }
}