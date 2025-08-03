import mainLogo from "../assets/education.gif";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="p-6 text-center max-w-md">
        {/* Logo Image */}
        <img
          src={mainLogo} // Replace this with the actual path to your logo file
          alt="LinguistIQ Logo"
          className="mx-auto mb-4 w-30 h-auto md:w-32 lg:w-80 rounded" // Responsive sizing
        />
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Welcome to LinguistIQ
        </h1>
        <p className="text-base md:text-lg">
          Please sign in to access the full features of the app.
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
