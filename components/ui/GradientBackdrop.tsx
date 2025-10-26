type GradientBackdropProps = {
  accentHex?: string;
};

const GradientBackdrop = ({ accentHex = "#22c55e" }: GradientBackdropProps) => (
  <div className="pointer-events-none">
    <div className="fixed inset-0">
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute inset-0 hidden dark:block transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle at 50% 100%,
            ${accentHex}66 0%,
            ${accentHex}4D 25%,
            ${accentHex}1A 55%,
            transparent 70%)`
        }}
      />
      <div
        className="absolute inset-0 block dark:hidden transition-all duration-1000 ease-in-out"
        style={{
          background: `radial-gradient(circle at 50% 100%,
            ${accentHex}33 0%,
            ${accentHex}1A 30%,
            transparent 60%)`
        }}
      />
    </div>
  </div>
);

export default GradientBackdrop;
