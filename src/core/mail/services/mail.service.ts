import { Injectable } from '@nestjs/common'
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public sendMail(options: ISendMailOptions) {
    return this.mailerService.sendMail(options)
  }
}
