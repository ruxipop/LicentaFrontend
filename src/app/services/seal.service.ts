import {Injectable} from '@angular/core';
import SEAL from 'node-seal'
import * as CryptoJS from 'crypto-js';
import {FileService} from "./file.service";
import {FileRequest} from "../models/fileRequest";
import {ChatSenderService} from "./chat-sender.service";
import {MessageRequest} from "../models/message";

@Injectable({
  providedIn: 'root'
})

export class SealService {
  private seal: any
  private schemeType: any
  private securityLevel: any
  private polyModulusDegree = 1024
  private bitSizes = [24]
  private bitSize = 15
  private encParms: any
  private context: any;
  private encoder: any
  private keyGenerator: any


  constructor(private fileService: FileService,) {
    this.initializeSEAL().then();
  }

  private async initializeSEAL() {
    this.seal = await SEAL();
    this.schemeType = this.seal.SchemeType.bfv
    this.securityLevel = this.seal.SecurityLevel.tc128
    this.encParms = this.seal.EncryptionParameters(this.schemeType);
    this.encParms.setPolyModulusDegree(this.polyModulusDegree);
    this.encParms.setCoeffModulus(
      this.seal.CoeffModulus.Create(
        this.polyModulusDegree,
        Int32Array.from(this.bitSizes)
      )
    );
    this.encParms.setPlainModulus(
      this.seal.PlainModulus.Batching(
        this.polyModulusDegree,
        this.bitSize
      )
    );
    this.context = this.seal.Context(
      this.encParms,
      false,
      this.securityLevel
    );
    this.encoder = this.seal.BatchEncoder(this.context)
    this.keyGenerator = this.seal.KeyGenerator(this.context)
    if (!this.context.parametersSet()) {
      throw new Error('Could not set the parameters in the given context. Please try different encryption parameters.');
    }
  }


  generateSecretKry(password: any, username: any) {
    const secretKey = this.keyGenerator.secretKey()
    const encrypted = CryptoJS.AES.encrypt(secretKey.save().trim(), password.trim()).toString();
    let f = new FileRequest(username, encrypted);
    this.fileService.saveSecretKey(f).subscribe()

  }

  generatePublicKey(username: any) {
    const publicKey = this.keyGenerator.createPublicKey()
    let f = new FileRequest(username, publicKey.save());
    this.fileService.savePublicKey(f).subscribe()

  }

  setSecretKey(username: any, password: any) {
    this.fileService.readSecretKey(username).subscribe(
      (data) => {
        const decryptedSecretKey = this.decryptSecretKey(data, password);
        const secretKey = this.seal.SecretKey();
        secretKey.load(this.context, decryptedSecretKey);
        localStorage.setItem("secretKey", secretKey.save())
      });


  }

  setPublicKey(username: any) {
    this.fileService.readPublicKey(username).subscribe((data) =>
      localStorage.setItem("publicKey", data)
    )
  }

  decryptSecretKey(secretKey: any, password: any) {
    return CryptoJS.AES.decrypt(secretKey, password.trim()).toString(CryptoJS.enc.Utf8);

  }

  encryptMessage(message: any) {
    const publicKey = this.seal.PublicKey()
    publicKey.load(this.context, localStorage.getItem("publicKey")!)
    const encryptor = this.seal.Encryptor(this.context, publicKey)
    const asciiArray = new Uint16Array(message.length)
    for (let i = 0; i < message.length; i++) {
      asciiArray[i] = message.charCodeAt(i)
    }
    const intArray = Int32Array.from(asciiArray);
    console.log(intArray.length)
    const plaintext = this.encoder.encode(intArray)
    const ciphertext = encryptor.encrypt(plaintext)
    return ciphertext.save();
  }




  decryptMessage(stringCiphertext: any) {
    const secretKey = this.seal.SecretKey()
    secretKey.load(this.context, localStorage.getItem("secretKey")!)
    const decryptor = this.seal.Decryptor(this.context, secretKey)
    const ciphertext = this.seal.CipherText()
    ciphertext.load(this.context, stringCiphertext)
    const decryptedPlaintext = decryptor.decrypt(ciphertext)
    const decryptedAsciiArray = this.encoder.decode(decryptedPlaintext)
    let decryptedString = ''
    for (let i = 0; i < decryptedAsciiArray.length; i++) {
       if(decryptedAsciiArray[i]!=0){
      decryptedString += String.fromCharCode(decryptedAsciiArray[i])}
    }
    return decryptedString;
  }


  encryptSenderMessage(message:string,senderId:string,receiverId:string,senderPass:string){
    return  CryptoJS.AES.encrypt(message.trim(),senderPass.trim()).toString();
  }

  decryptSenderMessage(message:string,senderPass:string){
    return  CryptoJS.AES.decrypt(message,senderPass.trim()).toString(CryptoJS.enc.Utf8);

  }


}
