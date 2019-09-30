import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public requestDatas = [];
  constructor() { }
}

export class RequestData {
  public dtmRequest: Date;
  public szActivityId: string;
  public szActivityName: string;
  public szDesc: string;
  public szLocation: string;
  public szStatusId: string;
  public szStatusName: string;
  public decTotal: number;
}

export class ActivityId {
  public static readonly AC001:string = "AC001";
  public static readonly AC002:string = "AC002";
  public static readonly AC003:string = "AC003";
  public static readonly AC004:string = "AC004";
  public static readonly AC005:string = "AC005";
  public static readonly AC006:string = "AC006";
}