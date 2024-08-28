public with sharing class FileUploaderExemple {
    @AuraEnabled
    public static List<ContentVersion> getFileExemple(){
        List<Id> contentDocId = new List<Id>();
        for(ContentDocumentLink cdl  :[SELECT ContentDocumentId  FROM ContentDocumentLink WHERE LinkedEntityId  ='a05KI000000MqeYYAS']){
            contentDocId.add(cdl.ContentDocumentId);
        }

        return [SELECT Id, ContentDocumentId, ContentSize,FileExtension,Statut__c,Title FROM ContentVersion WHERE IsDeleted = false AND IsLatest = true AND ContentDocumentId =:contentDocId  ];
    }
}