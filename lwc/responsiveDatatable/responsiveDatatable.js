import { LightningElement, api } from 'lwc';

export default class ResponsiveDatatable extends LightningElement {
	
	@api columnConfig; //array of objecs like [ { fieldName: 'Email', label:'E-mail' }, { fieldName:'Phone', label: 'Phone Number', type: 'phone'}]
	@api pkField;
	rows;
	_selectedRow;

    connectedCallback(){
        console.log('columnConfig>>',this.columnConfig);
    }

	@api
	get rowData() {
		return this.rows;
	}
	set rowData(value) {
		if (typeof value !== 'undefined') {
			this.rows = this.reformatRows(value);
		} 
	}

	@api setSelectedRecord(recordId) {
		let mySelector = `tr[data-pk='${recordId}']`;
		let selectedRow = this.template.querySelector(mySelector);
		if (selectedRow) {
			this.highlightSelectedRow(selectedRow);
		}
	}
	
	reformatRows = function(rowData) {
		let colItems = this.columnConfig;
		let reformattedRows = [];
        if(rowData&&colItems){
            for (let i = 0; i < rowData.length; i++) {
                let rowDataItems = [];
                for (let j = 0; j < colItems.length; j++) {
                    let colClass = '';
                    if (colItems[j].hiddenOnMobile) {
                        colClass = 'hiddenOnMobile';
                    }
                    rowDataItems.push({
                        value: rowData[i][colItems[j].fieldName],
                        label: colItems[j].label,
                        type: colItems[j].type,
                        class: colClass,
                        columnId: 'col' + j + '-' + rowData[i][this.pkField],
                        isPhone: (colItems[j].type==='phone'),
                        isEmail: (colItems[j].type==='email'),
                        isOther: (colItems[j].type!=='phone' && colItems[j].type!=='email')
                    });
                }
                reformattedRows.push({
                    data: rowDataItems,
                    pk: rowData[i][this.pkField]
                });
            }
        }

		return reformattedRows;
	}

	onRowClick(event) {
		let target = event.currentTarget;
		const evt = new CustomEvent( 'rowclick' , {
			detail: {
				pk: target.getAttribute('data-pk')
			}
		});
		this.dispatchEvent(evt);
		this.highlightSelectedRow(target);
	}
	
	onRowDblClick(event) {
		let target = event.currentTarget;
		const evt = new CustomEvent( 'rowdblclick' , {
			detail: {
				pk: target.getAttribute('data-pk')
			}
		});
		this.dispatchEvent(evt);
	}

	highlightSelectedRow(target) {
		if (this._selectedRow) {
			this._selectedRow.classList.remove("slds-is-selected");
		}
		target.classList.add("slds-is-selected");
		this._selectedRow = target;
	}

	
	
}