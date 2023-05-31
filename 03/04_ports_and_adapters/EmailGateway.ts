export default interface EmailGateway {
  send(
    subject: string,
    message: string,
    from: string,
    to: string
  ): Promise<void>;
}
