const Footer = () => {
    const linkSections = [
        {
            title: "Quick Links",
            links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
        },
        {
            title: "Need Help?",
            links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
        },
        {
            title: "Follow Us",
            links: ["Instagram", "Twitter", "Facebook", "YouTube"]
        }
    ];

    return (
        <div className=" py-16 px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <h2 className="font-semibold text-2xl md:text-3xl text-gray-900">
                        FreshBasket
                    </h2>
                    <p className="text-sm md:text-base mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est expedita ducimus distinctio repudiandae officia quod sint maiores, tempora veniam cupiditate minima dolorem doloribus libero, magnam ratione dolore corporis provident quo.
                    </p>
                </div>
                <div className="flex flex-wrap md:flex-nowrap justify-between w-full md:w-auto gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index} className="min-w-[140px]">
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:underline transition">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright 2025 © <a href="https://prebuiltui.com">PrebuiltUI</a> All Right Reserved.
            </p>
        </div>
    );
};

export default Footer;