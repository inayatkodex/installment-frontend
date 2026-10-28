import Image from "next/image";

const PhoneMockup = () => (
  <Image
    src="/images/hero-phone-mockup.svg"
    alt="Installment Pro mobile app showing today's installment collection"
    width={270}
    height={458}
    priority
    className="lp-phone"
  />
);

export default PhoneMockup;
