function WelcomeToHome() {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
      <img src="threadly.png" alt="threadly" className="w-[10rem]" />
      <h1 className="text-2xl">Welcome to Threadly</h1>
      <p className="max-w-96 text-center">
        Choose the contact you want to chat with or you can add new contact and
        start a conversation
      </p>
    </div>
  );
}

export default WelcomeToHome;
