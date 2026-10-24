import Image from "next/image";

const PhoneMockup = () => (
  <Image
    src="/images/Phone%20mockup.svg"
    alt="Installment Pro mobile app showing today's installment collection"
    width={270}
    height={458}
    priority
    className="lp-phone"
  />
);

export default PhoneMockup;
