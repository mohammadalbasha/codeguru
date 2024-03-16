// ** this is not the best practise to work with redis in nestjs ** //

//import Redis from "redis";
const Redis = require("redis");
import { ConfigService } from "../config/config";

export class CacheController {
  static _instance: CacheController;
  private redisClient;
  // private constructor to ensure Singleton
  private constructor() {}

  static instance() {
    if (CacheController._instance) return CacheController._instance;

    CacheController._instance = new CacheController();
    return CacheController._instance;
  }

  public async initialize() {
    this.redisClient = Redis.createClient({
      url: ConfigService.getRedisConfiguration().URL,
    }); //  url for production instance of redis // or ()
    this.redisClient.connect();
  }

  public getCache = (key: string) => {
    return this.redisClient.get(key).then((data: any, error: any) => {
      if (error) {
        return false;
      } else if (data) {
        console.log("cache hit");
        return JSON.parse(data);
      } else {
        console.log("cache miss");
        return false;
      }
    });
  };

  public setCache = (key: string, value: any) => {
    this.redisClient.setEx(key, 3600, JSON.stringify(value));
  };
  public clearCache = (key: string) => {
    return this.redisClient.del(key).then(() => {});
  };

  public getOrSetCache = (key: string, cb: any) => {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key).then(async (data: any, error: any) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        if (data) {
          console.log("cache hit");
          return resolve(JSON.parse(data));
        }
        console.log("cache miss");
        const new_data = await cb();
        this.redisClient.setEx(key, 3600, JSON.stringify(new_data));
        resolve(new_data);
      });
    });
  };
}
