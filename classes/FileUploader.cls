public without sharing class FileUploader {

  /*
    https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_contentdocumentlink.htm
    IdsViewShare : ShareType='V' aka The user can explicitly view but not edit the shared file.
    IdsInferredShare : ShareType='I' aka TThe user’s permission is determined by the related record.
  */

  @AuraEnabled
  public static Id uploadFiles(String base64, String filename, List<Id> idsViewShare, List<Id> idsInferredShare) {
    return uploadFilesWithStatut(base64,filename,IdsViewShare,IdsInferredShare,null);
  }


  @AuraEnabled
  public static Id uploadFilesWithStatut(String base64, String filename, List<Id> idsViewShared, List<Id> idsInferredShared,String contentVersionStatut) {

      ContentVersion cv = createContentVersion(base64, filename,contentVersionStatut);

      List<ContentDocumentLink> cdls = new List<ContentDocumentLink>();
      for(Id viewId : idsViewShared){
        cdls.add(createContentLink(cv.Id, viewId,'V','AllUsers'));
      }
      for(Id viewId : idsInferredShared){
        cdls.add(createContentLink(cv.Id, viewId,'I','AllUsers'));
      }

      insert cdls;
      return cv.Id;
  }



  private static ContentVersion createContentVersion(String base64, String filename,String status) {
      ContentVersion cv = new ContentVersion();
      cv.VersionData = EncodingUtil.base64Decode(base64);
      cv.Title = filename;
      cv.PathOnClient = filename;
      if(status!=null){
        cv.Statut__c = status ;
      }
      insert cv;
      return cv;
    }


    static Id contentDocumentId;
    private static ContentDocumentLink createContentLink(String contentVersionId, String linkedEntityId,String shareType,String visibility) {
      if(contentDocumentId==null){
        contentDocumentId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =: contentVersionId].ContentDocumentId;
      }
      return new ContentDocumentLink(ContentDocumentId=contentDocumentId, LinkedEntityId=linkedEntityId,ShareType=shareType,Visibility=visibility);
   }


   @AuraEnabled
   public static void deleteFile(Id cvId){
      Id contentDocId=  [Select ContentDocumentId from ContentVersion where Id=:cvId][0].ContentDocumentId;
      delete new  ContentDocument(Id=contentDocId);
   }

   @AuraEnabled(Cacheable=false)
   public static List<ContentVersion> getFileInfo(List<Id> cvIds ){
       return [SELECT Id, ContentDocumentId, ContentSize,FileExtension,Statut__c,Title FROM ContentVersion WHERE Id=:cvIds order by Title ];
   }

}