import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../config/api.service';
import { SharedService } from '../../shared/shared.service';
import { Constants } from '../config/Constant';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectComponentService {

  constructor(
    private api: ApiService,
    private restapi: SharedService,
    private http: HttpClient,
  ) { }



  // new service for feature details
  getAllFeatureDetailsByFeatureId(id): Observable<any> {
    return this.api.get(this.restapi.Apigateway + Constants.getAllFeatureDetailsByFeatureId + id);
  }
  getAllFeatureByFeatureid(id): Observable<any> {
    return this.api.get(this.restapi.Apigateway + `${Constants.getAllFeatureByFeatureid}/${id}`);
  }

  // codegenerate Api
  codeGenerate(projectId: any): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.projectGeneration}/${projectId}${Constants.GET}`);
  }

  // new apis for features
  saveFeatures(feature: any): Observable<any> {
    return this.api.post(`${this.restapi.Apigateway}${Constants.saveFeature}`, feature);
  }
  updateFeature(feature: any): Observable<any> {
    return this.api.put(`${this.restapi.Apigateway}${Constants.updateFeature}`, feature);
  }
  getAllFeature(): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getAllFeature}`);
  }
  getFeatureById(featureId: String): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getFeatureById}?featureId=${featureId}`);
  }
  getFeatureByProjectId(projectId: any): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getFeatureByProjectId}?projectId=${projectId}`);
  }
  deleteFeature(featureId: any): Observable<any> {
    return this.api.delete(`${this.restapi.Apigateway}${Constants.saveFeature}?featureId=${featureId}`);
  }
  updateFeatureEntity(featureId: any, details): Observable<any> {
    return this.api.put(`${this.restapi.Apigateway}${Constants.updateFeatureEntity}?featureId=${featureId}`, details);
  }
  getAllFlows(): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getAllFlow}`);
  }
  getEntityByFeatureId(featureId): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getEntityByFeatureId}?featureId=${featureId}`);
  }

  createEntity(entity: any): Observable<any> {
    return this.api.post(`${this.restapi.Apigateway}${Constants.saveEntity}`, entity);
  }
  updateEntity(entity: any): Observable<any> {
    return this.api.put(`${this.restapi.Apigateway}${Constants.updateEntity}`, entity);
  }

  deleteEntity(entityId: String): Observable<any> {
    return this.api.delete(`${this.restapi.Apigateway}${Constants.deleteEntity}` + `/${entityId}`);
  }
  getByIdEntity(entityId: any): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getEntity}/${entityId}`);
  }
  getEntityByProjectId(projectId: String): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getEntity}?projectId=${projectId}`);
  }
  getAllEntity(): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.allEntity}`);
  }

  Updatefeaturedetailsentity(featureid: any, entitydetails: any): Observable<any> {
    return this.http.put(`${this.restapi.Apigateway}${Constants.featureUpdateEntity}${featureid}`, entitydetails);
  }

  Deletefeaturedetailsentity(featureid: any, entityid: any): Observable<any> {
    return this.http.delete(`${this.restapi.Apigateway}${Constants.featuredeleteEntity}/${featureid}/${entityid}`);
  }

  getGlobalEntityByProjectId(projectId): Observable<any> {
    return this.http.get(`${this.restapi.Apigateway}${Constants.getGlobalEntityByProjectId}?projectId=${projectId}`);
  }


  updateEntityField(entity: any): Observable<any> {
    return this.api.put(`${this.restapi.Apigateway}${Constants.updateEntityFields}`, entity);
  }

  getAllEntityType(): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getAllEntityTypes}`);
  }


  quickConnectors(data): Observable<any> {
    return this.api.post(`${this.restapi.Apigateway}${Constants.quickConnectors}`, data);
  }


  saveManyProjectFlow(data) {
    return this.api.post(`${this.restapi.Apigateway}${Constants.saveManyProjectFlow}`, data);

  }

  getProjectFeatureFlows(projectFlowsId): Observable<any> {
    return this.api.post(`${this.restapi.Apigateway}${Constants.getProjectFeatureFlows}`, projectFlowsId);
  }

  updateProjectFlowComponents(projectFlowId, componentList): Observable<any> {
    return this.api.put(`${this.restapi.Apigateway}${Constants.updateProjectFlowComponent}?projectFlowId=${projectFlowId}`, componentList);
  }


  deleteProjectFlow(projectFlowId: String): Observable<any> {
    return this.api.delete(`${this.restapi.Apigateway}${Constants.deleteProjectFlow}?projectFlowId=${projectFlowId}`);
  }



  updateFlowCompConnectorById(data: any): Observable<any> {
    return this.api.put(`${this.restapi.Apigateway}${Constants.updateFlowCompConnectorById}`, data);
  }

  quickTestcustomConnectors(data: any): Observable<any> {
    console.log('data --service->>', data);
    return this.api.post(`${this.restapi.Apigateway}${Constants.quickTestcustomConnectors}`, data);
  }
  getConnectorById(connectorId: String): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getConnectorById}/${connectorId}`);

  }
  // delete microservie apis


  deleteFlowById(FlowId: String): Observable<any> {
    return this.api.delete(`${this.restapi.Apigateway}${Constants.deleteFlowById}/${FlowId}`);
  }

  deleteEntityById(entityId: String): Observable<any> {
    return this.api.delete(`${this.restapi.Apigateway}${Constants.deleteEntityById}` + `/${entityId}`);
  }

  updateQuickConnectorsById(updateFlow:any): Observable<any> {
    return this.api.put(`${this.restapi.Apigateway}${Constants.updateQuickConnectorsById}/${updateFlow._id}`, updateFlow);
  }

  getModifyConnectors() {
    return this.api.get(`${this.restapi.Apigateway}${Constants.getConnectors}`)

  }

  exportSharedServiceYaml(projectId): Observable<any> {
    return this.api.get(`${this.restapi.Apigateway}${Constants.sharedApplication}${projectId}`)

  }

  // updateQuickConnectorsById(updateFlow:any): Observable<any> {
  //   return this.api.post(`http://localhost:3013/updateConnectors`, updateFlow);
  // }

}
