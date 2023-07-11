import Image from "next/image";

const Navbar: React.FC = () => {
  return (
    <nav>
      <div className="w-screen bg-primary py-1 flex justify-center">
        <Image src="/images/kinshipnavbar.png" alt="Kinship Logo" width={110} height={32} />
      </div>
    </nav>
  );
};

export default Navbar;
