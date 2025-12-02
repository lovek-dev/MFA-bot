export default {
  name: "say",
  run(client, message, args) {
    message.channel.send(args.join(" "));
  }
};
