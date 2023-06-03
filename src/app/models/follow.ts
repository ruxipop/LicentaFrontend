import {User} from "./user";

export class Follow{
  follower?:User;
  followerId?:number;
  following?:User;
  followingId:number;

  constructor(followingId: number,followerId:number) {
    this.followerId=followerId;
    this.followingId=followingId;

  }
}
