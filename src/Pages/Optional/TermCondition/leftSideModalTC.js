import React, { useState } from "react";
import { Box, Switch, Text } from "@chakra-ui/react";

const LeftSideModalTC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const handleChange = () => {
    setIsChecked(!isChecked);
  };
  return (
    <div className="container pb-5">
      <div className="row text-justify">
        <div className="col-lg-12">
          <div className="d-flex justify-content-end gap-2 align-items-center">
            <p className="fw-bold">English</p>
            <Switch
              size="md"
              className="py-0 mb-0"
              isChecked={isChecked}
              onChange={handleChange}
            />
            <p className="fw-bold">বাংলা</p>
          </div>
        </div>

        {!isChecked ? (
          <>
            <div className="col-lg-12 px-1">
              <Text
                fontWeight={700}
                fontSize="20px"
                pb={"10px"}
                className="p-1"
              >
                Terms & Conditions
              </Text>
            </div>

            <Box pb={"30px"}>
              <Box className="bg-light my-1">
                <Text className="text-danger p-1 fw-bold">
                  Terms and Conditions
                </Text>
              </Box>
              <Box className="p-1">
                <Text pt={"3"}>
                  Before using any services provided by Triplover Ltd., it is
                  important to carefully read and understand the Terms &
                  Conditions. Triplover Ltd. reserves the right to amend or
                  update these Terms & Conditions without prior notice. By
                  accessing any materials, information, products, or services
                  offered by Triplover, you acknowledge and agree to abide by
                  these Terms & Conditions. If you do not agree with any part of
                  these Terms & Conditions, you must not use the website or make
                  reservations with us. We encourage you to periodically review
                  the terms to stay informed about any changes.
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    We as a connector -{" "}
                  </span>{" "}
                  <span>
                    While making arrangements with outside vendors, Triplover
                    Ltd. does not operate as the primary. Our role is simply to
                    facilitate connections between partners and various travel
                    service providers, such as airlines, hotels, and tour
                    operators. Triplover Ltd. holds no responsibility for any
                    errors or inaccuracies found on the Site, or for any
                    shortcomings of travel suppliers from whom you acquire
                    services via this Site. Please be advised that market
                    situations and circumstances might shift decisively, which
                    might lead to information available on our site being
                    out-of-date or faulty.
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    While booking from us -{" "}
                  </span>{" "}
                  <span>
                    Triplover Ltd. will operate as the main point of contact
                    and employ objectively appropriate procedures to help our
                    partners if any problems or difficulties occur during the
                    booking or travel period. We will consistently abide by the
                    regulations established by the relevant travel service
                    providers, such as airlines, hotels, and tour operators.
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>Refund Process - </span>{" "}
                  <span>
                    The company will reimburse the funds in the same manner they
                    were initially received. The refund process will be invoiced
                    to the agent’s account. However, the settlement would follow
                    the BSP report settlement procedure and take 3-4 weeks for
                    refund to be disbursed.
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>Payment Process - </span>{" "}
                  <span>
                    By initiating a payment on this site, you are explicitly
                    agreeing to allow the use of your personal information to
                    verify and validate your transactions. This process ensures
                    that no unauthorized individuals are using your credentials
                    without your consent. It is important to acknowledge that
                    the details you provide may be disclosed to third-party
                    payment gateway agencies solely for the purpose of
                    verification. Rest assured that your personal information
                    will not be used for any other purposes apart from verifying
                    and confirming your identity. Partners can opt for payment
                    through cash deposits at Triplover office and bank
                    transfers with our associated banks. We also accept online
                    payment through payment gateways such as bKash.
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>Partner Banks- </span>{" "}
                  <span>
                    Triplover Ltd. collaborates with the following reputable
                    banks to provide smooth payment process to our partners:
                    <br />
                    <div style={{ paddingLeft: "30px" }}>
                      <p>- Standard Chartered Bank </p>
                      <p>- United Commercial Bank Limited </p>
                      <p>- The City Bank Limited </p>
                      <p>- Dutch Bangla Bank Limited </p>
                      <p>- Eastern Bank Limited </p>
                      <p>- BRAC Bank Limited </p>
                      <p>- First Security Islami Bank </p>
                      <p>
                        - Mobile financial services including bkash, Nagad is
                        accepted as well on the number: 013-2281-9380{" "}
                      </p>
                    </div>
                  </span>
                </Text>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    Partial Payment Policy
                  </Text>
                </Box>

                <div style={{ paddingLeft: "30px" }}>
                  <p>
                    • Agency should have updated documents (NID and Trade
                    License) and mail it to pd@Triplover.com{" "}
                  </p>
                  <p>• No Partial Payment for non-refundable ticket. </p>
                  <p>• No partial for LCC carrier. </p>
                  <p>• All refundable tickets are available for Partial. </p>
                  <p>
                    • If ticket is booked on portal, commission is as per
                    system.{" "}
                  </p>
                  <p>
                    • Agency must have minimum partial amount of the ticket in
                    their Balance.{" "}
                  </p>
                  <p>
                    • Payment should be cleared within 2 transactions. (Example:
                    1st invoice will be Partial Amount and 2nd invoice will be
                    Due Balance Adjustment){" "}
                  </p>
                  <p>
                    • If the agency fails to pay the due amount, the ticket will
                    be refunded automatically.{" "}
                  </p>
                  <p>
                    • If any agency has any queries about payment, they can
                    directly contact their key account manager.{" "}
                  </p>
                  <p>
                    • 1,000 AED charge for partial payment refund and 200 AED
                    Charge for Void.
                  </p>
                  <p>
                    • Refund will be done as before including airlines charge &
                    additional charges.{" "}
                  </p>
                </div>

                <Box className="mt-3">
                  <Text className="p-1 fw-bold">Payment Slab:</Text>
                </Box>

                <div style={{ paddingLeft: "30px" }}>
                  <p>- If flight within 0-7 Days (No Partial) </p>
                  <p>
                    - If flight within 8-10 Days (must be paid within 3 days){" "}
                  </p>
                  <p>
                    - If flight within 11-15 days (must be paid within 7 days){" "}
                  </p>
                  <p>
                    - If flight within 15 days or later (must be paid within 10
                    days){" "}
                  </p>
                  <p className="my-2">
                    • For Void & Reissue, Full amount should be adjusted/paid
                    before requesting.{" "}
                  </p>
                </div>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    No Liability for Onward Sales
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span>
                    Triplover Ltd. Is not responsible if your customers buy
                    travel services from you. Selling our travel services is
                    entirely your job, and we won't be held accountable for any
                    problems that might arise. We don't take responsibility for
                    issues with the travel service or any disputes between you
                    and your customer. We only provide the information we get
                    from our suppliers, and it's your responsibility to
                    double-check and confirm that information with your
                    customers before charging them. If your customer is denied
                    entry to a country by immigration, faces fines for a false
                    visa or passport issues, or any other reason, you're the one
                    who must cover the costs
                  </span>
                </Text>

                <Box className="bg-light mt-5 mb-3">
                  <Text className="text-danger p-1 fw-bold">
                    Important Notice! One-way & Round-Trip flight ticket
                    issuance
                  </Text>
                </Box>

                <div style={{ paddingLeft: "30px" }}>
                  <p>
                    • Please ensure the accurate and proper uploading of
                    customer’s Passport and Visa copies.{" "}
                  </p>
                  <p>
                    • When buying a ticket through Triplover, it is obligatory
                    to submit customer’s passport and visa copies. Failure to
                    provide these documents will lead to the cancellation of
                    your booking by Triplover. The company reserves the right
                    to cancel any booking if the required documents are not
                    received within the specified time frame.{" "}
                  </p>
                  <p>
                    • Make sure that the Surname and Given Name provided match
                    customer’s Passport accurately. Note that name changes are
                    not allowed after ticket issuance.{" "}
                  </p>
                  <p>
                    • Before making an instant ticket purchase, carefully review
                    Country Restrictions and Airline Policies.{" "}
                  </p>
                  <p>
                    • Before any instant ticket purchase, thoroughly review the
                    Airline Fare rules concerning refundability and
                    changeability.{" "}
                  </p>
                  <p>
                    • Triplover bears no responsibility for improper or
                    fraudulent document submissions by agents or passengers,
                    which may result in deportation or offloading by the airline
                    or arrival authorities.{" "}
                  </p>
                  <p>
                    • Following the instant ticket purchase, Triplover will
                    not be held responsible for any errors made by passengers
                    regarding names, documents, fare policies, airline policies,
                    or country restrictions.{" "}
                  </p>
                  <p>
                    • Passport validity must extend beyond 6 months from the
                    travel date. Triplover will not be responsible if
                    passengers are unable to travel due to passport validity
                    issues.{" "}
                  </p>
                  <p>
                    • In the case of extended passenger names, please use the
                    short form of the Given Name and the full form of the
                    Surname.{" "}
                  </p>
                  <p>
                    • If two passengers share the same name, they must be issued
                    through separate PNR. Or Triplover Will not take any
                    responsibility for any ticketing error.{" "}
                  </p>
                  <p>
                    • In case of no-show no refunds will be applicable as per
                    Airline policy.{" "}
                  </p>
                  <p>
                    • For Biman Bangladesh or Sri Lankan Airlines, when dealing
                    with a passenger with a single name, it is required to use
                    "FNU" as the given name, and the surname should match the
                    single name as per the passport. In the case of Saudi
                    Airlines, if the passport displays a single name, the
                    booking should align with the visa information.{" "}
                  </p>
                  <p>
                    • If your customers have more baggage than allowed by the
                    airline, they'll need to pay extra fees set by each airline.
                    When there are connecting flights with different airlines,
                    they may have to pick up their bags at the connecting
                    airport and check them in again, incurring additional fees
                    if they have excess baggage.{" "}
                  </p>
                  <p>
                    • Airlines can make changes to their schedules, and this is
                    something we can't control. These changes might be based on
                    predictions for future travel needs or unexpected
                    adjustments on the same day. Triplover is not responsible
                    for any issues arising from cancelled or missed flights due
                    to these changes. We'll let you know about the changes once
                    we're informed by the airlines or suppliers, and it's your
                    responsibility to inform your customers about them.{" "}
                  </p>
                </div>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    Service Delivery Period
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span>
                    Flight bookings are typically instantaneous, and agencies
                    receive their e-tickets immediately upon confirmation. The
                    service delivery period for flight bookings is immediate.
                  </span>
                </Text>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    After Sales Services
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span style={{ fontWeight: "bold" }}>Customer Support: </span>{" "}
                  <span>
                    Provide accessible and responsive customer support channels,
                    such as phone, email, or live chat, to address any
                    post-travel inquiries, concerns, or issues.
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    Traveler Assistance:{" "}
                  </span>{" "}
                  <span>
                    Offer assistance for issues that may arise during travel,
                    such as flight delays, cancellations, or changes to travel
                    plans. Provide clear guidance on how agencies can reach out
                    for support.
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    Emergency Support:{" "}
                  </span>{" "}
                  <span>
                    Establish protocols for handling emergency situations, such
                    as natural disasters or unexpected travel disruptions.
                    Communicate emergency contact information and procedures to
                    agencies.
                  </span>
                </Text>
                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    Documentation and Information:{" "}
                  </span>{" "}
                  <span>
                    Provide customers with documentation before and after their
                    trips, including detailed itineraries, important contact
                    numbers, and any post-travel information they may need.
                  </span>
                </Text>
                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    Upcoming Travel Offers:{" "}
                  </span>{" "}
                  <span>
                    Keep agencies informed about upcoming travel promotions,
                    special offers, or new destinations. Maintain engagement to
                    encourage repeat business.
                  </span>
                </Text>
                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    Personalized Communication:{" "}
                  </span>{" "}
                  <span>
                    Use personalized communication to stay connected with
                    agencies. Send greetings or updates on travel trends to
                    foster a sense of connection and care.
                  </span>
                </Text>
                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    Continuous Improvement:{" "}
                  </span>{" "}
                  <span>
                    Regularly evaluate customer feedback and use it to make
                    continuous improvements to services, processes, and
                    offerings. Demonstrate a commitment to evolving and meeting
                    customer expectations.
                  </span>
                </Text>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    Two Factor Authentication Terms and Conditions
                  </Text>
                </Box>

                <Box className="my-2">
                  <Text className="p-1 fw-bold">
                    Two-factor authentication (2FA) –
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span>
                    Two-factor authentication (2FA), sometimes referred to as
                    two-step verification or dual-factor authentication, is a
                    security process in which users provide two different
                    authentication factors to verify themselves. To enhance the
                    security of our platform and protect your agency's account,
                    Triplover is initiating Two Factor Authentication (2FA).
                    This additional layer of security is essential to safeguard
                    sensitive information and prevent unauthorized access to
                    your account.
                  </span>
                </Text>

                <Box className="my-2">
                  <Text className="p-1 fw-bold">
                    How to activate: <br></br>
                    For your reference, here are the key steps involved in the
                    Two-Factor Authentication re-activation process:
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span>
                    Select Profile &gt; New Security Option &gt; Request Email
                    Verification &gt; Submit OTP &gt; Enable Two-Factor
                    Authentication This will verify your email and make sure
                    that both of the factors such as your password and Email OTP
                    are there to secure your account in case of any unwanted
                    access.
                  </span>
                </Text>
                <Box className="mt-3">
                  <Text className="p-1 fw-bold">Terms of Use: </Text>
                </Box>
                <div style={{ paddingLeft: "30px" }}>
                  <p>
                    • The agencies are required to verify their email for their
                    account and make sure to have reasonable security efforts in
                    place on their part to protect the email account from
                    unwanted access.
                  </p>
                  <p>
                    • Every agency should activate the two-factor authentication
                    (2FA) feature in their account and regularly use the feature
                    to protect their account from suspicious login.
                  </p>
                  <p>
                    • Agencies are required to allow location access to identify
                    where they logged in from for security follow-ups.
                  </p>
                  <p>
                    • For any complaints regarding the 2fa feature not
                    activating or working properly the agency should inform
                    their account manager within one working day.
                  </p>
                  <p>
                    • The agency is free to not use this feature, however,
                    Triplover will not be liable for any damage suffered in
                    case of a security breach or third-party invasion.
                  </p>
                  <p>
                    • Triplover may update these terms at any time. If any
                    changes take place, agency will be notified through email
                    and by revising the Triplovers’ terms and conditions page.
                  </p>
                  <p>
                    • The agency is responsible for maintaining the
                    confidentiality of your 2FA codes and for all activities
                    that occur under their account. Triplover is not liable
                    for any loss or damage arising from agencies failure to
                    comply with this provision.
                  </p>
                </div>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <div className="col-lg-12 px-1">
              <Text
                fontWeight={700}
                fontSize="20px"
                pb={"10px"}
                className="p-1"
              >
                শর্তাবলি ও নীতিমালা
              </Text>
            </div>

            <Box pb={"30px"}>
              <Box className="bg-light my-1">
                <Text className="text-danger p-1 fw-bold">
                  শর্তাবলি ও নীতিমালা
                </Text>
              </Box>
              <Box className="p-1">
                <Text pt={"3"}>
                  ট্রাভেল চ্যাম্প লিমিটেড দ্বারা প্রদত্ত যেকোনো সেবা ব্যবহারের
                  পূর্বে, ব্যবহারের শর্তাবলি সাবধানে পড়া এবং বোঝা গুরুত্বপূর্ণ।
                  যেকোনো পূর্ববর্তী বিজ্ঞপ্তি ছাড়া ট্রাভেল চ্যাম্প লিমিটেড
                  যেকোনো সময় তার শর্তাবলি ও নীতিমালায় পরিবর্তন বা পরিমার্জন করার
                  অধিকার রাখে। ট্রাভেল চ্যাম্প লিমিটেড এর যেকোনো তথ্য, পণ্য বা
                  সেবা ব্যবহারের মাধ্যমে আপনি এই শর্তাবলি মেনে নিতে এবং মেনে
                  চলার সম্মতি প্রদান করছেন। যদি আপনি এই শর্তাবলীর কোনো অংশে
                  অসম্মত হন, তবে আপনাকে আমাদের ওয়েবসাইট ব্যবহার করা থেকে
                  নিরুৎসাহিত করা হচ্ছে। যেকোনো পরিবর্তন সম্পর্কে অবগত থাকার জন্য
                  আমরা আপনাকে আমাদের শর্তাবলির প্রতি পর্যায়ক্রমে লক্ষ রাখতে করতে
                  উৎসাহিত করি।
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    আমরা সংযোগকারী হিসাবে-{" "}
                  </span>{" "}
                  <span>
                    ট্রাভেল চ্যাম্প লিমিটেড এর ভূমিকা প্রাথমিক অপারেটর হিসাবে
                    কাজ করার পরিবর্তে কেবল ভ্রমণকারী এবং বিভিন্ন ভ্রমণ পরিষেবা
                    প্রদানকারী যেমন এয়ারলাইনস, হোটেল এবং ট্যুর অপারেটরদের মধ্যে
                    সংযোগ সহজতর করা। সাইটে পাওয়া কোনো ভুল-ত্রুটির জন্য বা ভ্রমণ
                    সরবরাহকারীদের (যাদের কাছ থেকে আপনি এই সাইটের মাধ্যমে
                    পরিষেবাগুলি অর্জন করেন) কোনো ত্রুটির জন্য ট্রাভেল চ্যাম্প
                    লিমিটেড দায়বদ্ধ নয়। বাজারের অবস্থা এবং পরিস্থিতি
                    নিশ্চিতভাবে যেকোনো সময় পরিবর্তিত হতে পারে, যা আমাদের সাইটেও
                    পরিলক্ষিত হতে পারে।
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    আমাদের থেকে বুকিং করার সময় -{" "}
                  </span>{" "}
                  <span>
                    ট্রাভেল চ্যাম্প লিমিটেড যোগাযোগের প্রধান মাধ্যম হিসাবে গণ্য
                    হবে এবং বুকিং বা ভ্রমণের সময় কোনো ধরনের সমস্যা দেখা দিলে
                    গ্রাহককে সাহায্য করার জন্য বস্তুনিষ্ঠভাবে উপযুক্ত ব্যবস্থা
                    গ্রহণ করবে । আমরা প্রাসঙ্গিক ভ্রমণ পরিষেবা প্রদানকারী, যেমন
                    এয়ারলাইনস, হোটেল এবং ট্যুর অপারেটরদের দ্বারা প্রতিষ্ঠিত
                    বিধিমালা যথাযথভাবে অনুসরণ করব।
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    রিফান্ড প্রক্রিয়া-{" "}
                  </span>{" "}
                  <span>
                    যে মাধ্যমে প্রাথমিকভাবে পেমেন্ট গ্রহণ করেছিলো, সেই একই
                    মাধ্যমে অর্থ ফেরত দেবে। অর্থাৎ ব্যবহারকারী লেনদেনের জন্য যে
                    পেমেন্ট পদ্ধতি ব্যবহার করেছিলেন রিফান্ডের জন্য সেই পেমেন্ট
                    মাধ্যমই ব্যবহার বা অনুসরণ করা হবে। রিফান্ড এজেন্টের
                    অ্যাকাউন্টে প্রসেস করা হবে। যেহেতু সেটেলমেন্টটি বিএসপি
                    রিপোর্ট অনুযায়ী সেটেলমেন্ট পদ্ধতি অনুসরণ করে তাই রিফান্ড
                    করতে ৩-৪ সপ্তাহ সময় লাগবে।
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    পেমেন্ট প্রক্রিয়া-{" "}
                  </span>{" "}
                  <span>
                    এই সাইটে পেমেন্ট শুরু করার মাধ্যমে, আপনি স্পষ্টভাবে অনুমতি
                    দিচ্ছেন যে, আপনার লেনদেনগুলির যাচাইকরণ এবং বৈধতার জন্য আপনার
                    ব্যক্তিগত তথ্য ব্যবহার করা হবে। এই প্রক্রিয়াটি নিশ্চিত করে
                    যে আপনার সম্মতি ছাড়া কোনো অননুমোদিত ব্যক্তি আপনার পরিচয়
                    সংক্রান্ত তথ্য ব্যবহার করছে না। শুধুমাত্র যাচাইয়ের
                    উদ্দেশ্যে আপনার প্রদত্ত তথ্য তৃতীয় পক্ষের পেমেন্ট গেটওয়ে
                    এজেন্সির কাছে প্রকাশ করা যেতে পারে, এক্ষেত্রে আপনার সম্মতি
                    খুবই গুরুত্বপূর্ণ । নিশ্চিত থাকুন যে, আপনার ব্যক্তিগত তথ্য
                    আপনার পরিচয় যাচাই এবং নিশ্চিতকরণের বাইরে অন্য কোনো
                    উদ্দেশ্যে ব্যবহার করা হবে না । পার্টনারগণ ট্রাভেল চ্যাম্প
                    অফিসে এসে সরাসরি নগদ অর্থ জমা এবং ব্যাংক ট্রান্সফারের
                    মাধ্যমে পেমেন্ট করতে পারবেন। ব্যাংক ট্রান্সফার শুধুমাত্র
                    আমাদের পার্টনার ব্যাংকের ক্ষেত্রে প্রযোজ্য। এছাড়াও আমরা
                    বিকাশের মত পেমেন্ট গেটওয়ের মাধ্যমে অনলাইন পেমেন্ট গ্রহণ
                    করি।
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>পার্টনার ব্যাংকঃ </span>{" "}
                  <span>
                    পার্টনারগণ নিম্নলিখিত স্বনামধন্য ব্যাংকগুলোর মাধ্যমে সহজেই
                    পেমেন্ট প্রসেস নিশ্চিত করতে পারবেনঃ
                    <br />
                    <div style={{ paddingLeft: "30px" }}>
                      <p>- স্ট্যান্ডার্ড চার্টার্ড ব্যাংক </p>
                      <p>- ইউনাইটেড কমার্শিয়াল ব্যাংক লিমিটেড </p>
                      <p>- সিটি ব্যাংক লিমিটেড </p>
                      <p>- ডাচ্-বাংলা ব্যাংক </p>
                      <p>- ইস্টার্ন ব্যাংক লিমিটেড </p>
                      <p>- ইসলামী ব্যাংক বাংলাদেশ লিমিটেড </p>
                      <p>- ব্র্যাক ব্যাংক লিমিটেড </p>
                      <p>- ফার্স্ট সিকিউরিটি ইসলামী ব্যাংক </p>
                      <p>
                        - মোবাইল ফিন্যান্সিয়াল সার্ভিসেস প্ল্যাটফর্ম যেমন
                        বিকাশ, নগদ ইত্যাদির মাধ্যমেও পেমেন্ট গৃহীত হয় এই
                        নম্বরেঃ 013-2281-9380
                      </p>
                    </div>
                  </span>
                </Text>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    পারশিয়াল পেমেন্টের নীতি :
                  </Text>
                </Box>

                <div style={{ paddingLeft: "30px" }}>
                  <p>
                    • এজেন্সির আপডেট হওয়া ডকুমেন্ট (NID and Trade License)
                    থাকতে হবে এবং pd@Triplover.com-এ ডকুমেন্টটি মেইল করতে হবে।
                  </p>
                  <p>
                    • নন-রিফান্ডেবল টিকেটের জন্য কোন পারশিয়াল পেমেন্ট প্রযোজ্য
                    নয়।{" "}
                  </p>
                  <p>
                    • LCC ক্যারিয়ারের জন্য কোন পারশিয়াল পেমেন্ট প্রযোজ্য নয়।{" "}
                  </p>
                  <p>
                    • সকল রিফান্ডেবল টিকেটের ক্ষেত্রে পারশিয়াল পেমেন্ট প্রযোজ্য
                    হবে।{" "}
                  </p>
                  <p>
                    • পোর্টালে টিকেট বুক করা হলে, কমিশন সিস্টেম অনুযায়ী
                    প্রযোজ্য হবে।
                  </p>
                  <p>
                    • পার্টনার এজেন্সির ব্যালেন্সে টিকেটের ন্যূনতম পারশিয়াল
                    পরিমাণ থাকতে হবে।
                  </p>
                  <p>
                    • সম্পূর্ণ পেমেন্ট ২টি লেনদেনের মধ্যে নিষ্পত্তি করতে হবে।
                    (উদাহরণ: প্রথমটি হবে পারশিয়াল পরিমাণ এবং দ্বিতীয়টি হবে
                    বকেয়া ব্যালেন্স অ্যাডজাস্টমেন্ট)
                  </p>
                  <p>
                    • এজেন্সি বকেয়া টাকা পরিশোধ করতে ব্যর্থ হলে টিকিট
                    স্বয়ংক্রিয়ভাবে রিফান্ড করে দেয়া হবে।
                  </p>
                  <p>
                    • পেমেন্ট সম্পর্কে যেকোনো প্রশ্ন থাকলে সরাসরি অ্যাকাউন্ট
                    ম্যানেজারের সাথে যোগাযোগের অনুরোধ করা হচ্ছে।
                  </p>
                  <p>
                    • পারশিয়াল পেমেন্ট রিফান্ডের জন্য ১০০০ টাকা এবং ভয়েডের জন্য
                    ২০০ টাকা চার্জ প্রযোজ্য হবে।
                  </p>
                  <p>
                    • এয়ারলাইন্স চার্জ, অতিরিক্ত চার্জ সহ অন্যান্য চার্জ
                    পূর্বের মতই রিফান্ড করা হবে।
                  </p>
                </div>

                <Box className="mt-3">
                  <Text className="p-1 fw-bold">পেমেন্ট স্ল্যাব: </Text>
                </Box>

                <div style={{ paddingLeft: "30px" }}>
                  <p>
                    - ০-৬ দিনের মধ্যে ফ্লাইটের ক্ষেত্রে পারশিয়াল পেমেন্ট
                    প্রযোজ্য নয়{" "}
                  </p>
                  <p>
                    - ৭-১০ দিনের মধ্যে ফ্লাইটের ক্ষেত্রে ৩ দিনের মধ্যে পরিশোধ
                    করতে হবে
                  </p>
                  <p>
                    - ১১-১৫ দিনের মধ্যে ফ্লাইটের ক্ষেত্রে ৭ দিনের মধ্যে পরিশোধ
                    করতে হবে
                  </p>
                  <p>
                    - ১৫ দিনের মধ্যে বা তার পরের ফ্লাইটের ক্ষেত্রে ১০ দিনের
                    মধ্যে পরিশোধ করতে হবে
                  </p>
                  <p className="my-2">
                    - ভয়েড এবং রি-ইস্যুর জন্য রিকুয়েস্ট করার পূর্বে সম্পূর্ণ
                    পরিমাণ পরিশোধ করতে হবে।
                  </p>
                </div>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    পরবর্তী বিক্রয়ের জন্য কোনো দায়বদ্ধতা নেই :
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span>
                    আপনার পার্টনার যদি আপনার কাছ থেকে কোনো ভ্রমন সেবা কেনেন
                    তাহলে Triplover Ltd. কোনোভাবে দায়ী নয়৷ আমাদের ভ্রমণ সেবা
                    বিক্রি করা সম্পূর্ণরূপে আপনার কাজ, এবং যে কেনো ধরনের সমস্যার
                    জন্য আমরা দায়বদ্ধ হব না৷ আমরা ভ্রমণ সেবা সমস্যা বা আপনার
                    এবং আপনার পার্টনার মধ্যে কোনও বিবাদের জন্য দায়বদ্ধ নই। আমরা
                    কেবলমাত্র আমাদের সরবরাহকারীদের কাছ থেকে যে তথ্য পাই তা
                    প্রদান করি এবং আপনার পার্টনার চার্জ করার আগে তাদের সাথে
                    তথ্যটি দুই বার পরীক্ষা করা এবং নিশ্চিত করা আপনার দায়িত্ব।
                    যদি আপনার পার্টনারের কোনো গ্রাহক কে ইমিগ্রেশন দ্বারা একটি
                    দেশে প্রবেশ করতে বাধা দেওয়া হয়, একটি ভুল ভিসা বা পাসপোর্ট
                    সংক্রান্ত সমস্যার জন্য জরিমানা করা হয়, বা অন্য কোনো কারণে,
                    তাহলে আপনার পার্টনারকে অবশ্যই খরচগুলি বহন করতে হবে।
                  </span>
                </Text>

                <Box className="bg-light mt-5 mb-3">
                  <Text className="text-danger p-1 fw-bold">
                    গুরুত্বপূর্ণ নোটিশ! ওয়ান-ওয়ে এবং রাউন্ড-ট্রিপ ফ্লাইট টিকেট
                    ইস্যু
                  </Text>
                </Box>

                <div style={{ paddingLeft: "30px" }}>
                  <p>
                    • অনুগ্রহ করে আপনার পাসপোর্ট এবং ভিসার সঠিক এবং যথাযথ কপি
                    আপলোড নিশ্চিত করুন।
                  </p>
                  <p>
                    • ট্রাভেল চ্যাম্প এর মাধ্যমে টিকেট কেনার সময় পাসপোর্ট এবং
                    ভিসার কপি জমা দেওয়া বাধ্যতামূলক। এই ডকুমেন্টগুলো প্রদান
                    করতে ব্যর্থ হলে দ্বারা আপনার বুকিং বাতিল করা হবে। নির্দিষ্ট
                    সময়সীমার মধ্যে প্রয়োজনীয় ডকুমেন্ট না পাওয়া গেলে ট্রাভেল
                    চ্যাম্প সেই বুকিং বাতিল করার অধিকার রাখে।
                  </p>
                  <p>
                    • অনুগ্রহ করে নিশ্চিত করুন বংশগত নাম এবং প্রদত্ত নাম যেন
                    পাসপোর্টের সাথে সঠিকভাবে মিলে। টিকেট ইস্যু করার পর নাম
                    পরিবর্তন প্রযোজ্য নয়।
                  </p>
                  <p>
                    • তাৎক্ষণিক টিকেট কেনার পূর্বে, দেশের বিধিনিষেধ এবং
                    এয়ারলাইন নীতিগুলো সাবধানে পর্যালোচনা করুন ৷
                  </p>
                  <p>
                    • তাৎক্ষণিক টিকেট কেনার পূর্বে, রিফান্ড এবং পরিবর্তন
                    সম্পর্কিত এয়ারলাইন কর্তৃক নির্ধারিত নীতিগুলো যথাযথভাবে
                    পর্যালোচনা করুন ৷
                  </p>
                  <p>
                    • পার্টনার এজেন্ট বা যাত্রীদের দ্বারা অনুপযুক্ত বা
                    জালিয়াতিপূর্ণ নথি জমা দেওয়ার ফলে এয়ারলাইন বা সংশ্লিষ্ট
                    কর্তৃপক্ষ কর্তৃক নির্বাসন বা অফলোডিং হতে পারে। এর জন্য
                    ট্রাভেল চ্যাম্প কোনোভাবে দায়বদ্ধ না ।
                  </p>
                  <p>
                    • তাৎক্ষণিক টিকেট কেনার পর, নাম, ডকুমেন্ট, এয়ারলাইন নীতি বা
                    দেশের সীমাবদ্ধতা সম্পর্কিত পার্টনার এজেন্ট বা যাত্রীদের
                    দ্বারা করা কোনো ত্রুটির জন্য ট্রাভেল চ্যাম্প দায়ী থাকবে না।
                  </p>
                  <p>
                    • পাসপোর্টের মেয়াদ অবশ্যই ভ্রমণের তারিখ থেকে ৬ মাসের বেশি
                    হতে হবে। পাসপোর্টের মেয়াদের সমস্যার কারণে যাত্রীরা ভ্রমণ
                    করতে না পারলে ট্রাভেল চ্যাম্প দায়ী থাকবে না।
                  </p>
                  <p>
                    • যাত্রীর বর্ধিত নামের ক্ষেত্রে, অনুগ্রহ করে প্রদত্ত নামের
                    সংক্ষিপ্ত রূপ এবং বংশগত নামের পূর্ণ রূপ ব্যবহার করুন।
                  </p>
                  <p>
                    • ২ জন প্যাসেঞ্জারের নাম একই হলে তাদেরকে আলাদা আলাদা পিএনআর
                    এর মাধ্যমে ইস্যু করতে হবে নতুবা কোনো রকমের টিকেটিং এররের
                    জন্য ট্রাভেল চ্যাম্প দায় নেবে না।
                  </p>
                  <p>
                    • এয়ারলাইন নীতি অনুযায়ী নো-শো এর ক্ষেত্রে কোনো রিফান্ড
                    প্রযোজ্য হবে না।
                  </p>
                  <p>
                    • বিমান বাংলাদেশ বা শ্রীলঙ্কান এয়ারলাইন্সের জন্য, একক নামের
                    একজন যাত্রীর ক্ষেত্রে প্রদত্ত নাম হিসাবে "FNU" ব্যবহার করতে
                    হবে এবং পাসপোর্ট অনুসারে বংশগত নাম একক নামের সাথে মিলতে হবে
                    ৷ সৌদি এয়ারলাইন্সের ক্ষেত্রে, যদি পাসপোর্টে একক নাম থাকে
                    তবে ভিসার তথ্যের সাথে বুকিংটির মিল থাকতে হবে।
                  </p>
                  <p>
                    • যদি আপনার গ্রাহকদের কাছে এয়ারলাইনের অনুমতির চেয়ে বেশি
                    লাগেজ থাকে, তাহলে তাদের প্রতিটি এয়ারলাইন দ্বারা নির্ধারিত
                    অতিরিক্ত লাগেজ ফি পরিশোধ করতে হবে। বিভিন্ন এয়ারলাইন্সের
                    সাথে কানেক্টিং ফ্লাইট থাকলে, কানেক্টিং এয়ারপোর্টে লাগেজ
                    নিয়ে আবার চেক ইন করতে হতে পারে এবং অতিরিক্ত লাগেজ থাকলে
                    অতিরিক্ত ফি দিতে হবে।
                  </p>
                  <p>
                    • এয়ারলাইন্স তাদের সময়সূচীতে পরিবর্তন করতে পারে এবং এটি
                    আমাদের নিয়ন্ত্রণ ক্ষমতার বাইরে। এই পরিবর্তনগুলো ভবিষ্যতের
                    ভ্রমণের প্রয়োজন বা একই দিনে অপ্রত্যাশিত সমন্বয়গুলির
                    পূর্বাভাসের উপর ভিত্তি করে হতে পারে। এই পরিবর্তনগুলোর কারণে
                    ফ্লাইট ক্যান্সেল বা মিস করা সংক্রান্ত কোনো সমস্যার জন্য
                    ট্রাভেল চ্যাম্প দায়ী নয়। এয়ারলাইনস বা সরবরাহকারীর দ্বারা
                    আমাদের জানানো হলে আমরা পরিবর্তনগুলো সম্পর্কে আপনাকে জানাব।
                    তবে গ্রাহকদের অবগত করার সম্পূর্ণ দায়িত্ব পার্টনার
                    এজেন্টদের৷
                  </p>
                </div>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    পরিষেবা প্রদানের সময়কাল:
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span>
                    ফ্লাইট বুকিং সাধারণত তাৎক্ষণিক হয় এবং যাত্রীরা নিশ্চিত হওয়ার
                    সাথে সাথেই তাদের ই-টিকেট পেয়ে যান। ফ্লাইট টিকেটের ক্ষেত্রে
                    এজেন্সি পোর্টাল থেকে ই-টিকেট ডাউনলোড করে নিতে পারেন।
                  </span>
                </Text>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    বিক্রয়োত্তর সেবা:
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span style={{ fontWeight: "bold" }}>গ্রাহক সহায়তা: </span>{" "}
                  <span>
                    ভ্রমণ-পরবর্তী যেকোন জিজ্ঞাসা বা সমস্যা সমাধানের জন্য আমাদের
                    রয়েছে বিভিন্ন গ্রাহক সহায়তার মাধ্যম যেমন- ফোন, ইমেইল বা লাইভ
                    চ্যাট যেখানে যোগাযোগের মাধ্যমে গ্রাহক তার সমস্যার সমাধান
                    করতে পারবেন।
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>ভ্রমণকারী সহায়তা: </span>{" "}
                  <span>
                    ভ্রমণের সময় যে সমস্যাগুলো দেখা দিতে পারে যেমন ফ্লাইট বিলম্ব,
                    বাতিলকরণ বা ভ্রমণ পরিকল্পনায় পরিবর্তন হলে এজেন্সিদের সঠিক
                    সময়ে তথ্য প্রদান করে সহায়তা করা হয়।
                  </span>
                </Text>

                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>জরুরী সহায়তা: </span>{" "}
                  <span>
                    প্রাকৃতিক দূর্যোগ বা অপ্রত্যাশিত ভ্রমণ ব্যাঘাতের মতো জরুরী
                    পরিস্থিতিতে এজেন্সিদের সংশ্লিষ্ট যোগাযোগের তথ্য এবং
                    প্রয়োজনীয় সহায়তা প্রদান করা হয়। ডকুমেন্টেশন এবং তথ্য:
                    গ্রাহকদের ভ্রমণের আগে এবং পরে ডকুমেন্টেশন প্রদান করা হয়
                    যেখানে বিশদ এবং গুরুত্বপূর্ণ তথ্য যা তাদের ভ্রমণের ক্ষেত্রে
                    প্রয়োজন হতে পারে।
                  </span>
                </Text>
                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>আসন্ন ভ্রমণ অফার: </span>{" "}
                  <span>
                    চলমান বা আসন্ন ভ্রমণের বিশেষ অফার বিভিন্ন মাধ্যমে এজেন্সিদের
                    অবহিত করার মাধ্যমে ব্যবসায় পুনরাবৃত্তিতে উৎসাহিত করা হয়।
                  </span>
                </Text>
                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>
                    ব্যক্তিগত যোগাযোগ:{" "}
                  </span>{" "}
                  <span>
                    ব্যক্তিগত যোগাযোগের মাধ্যমে ব্যবসায়িক সম্পর্কের উন্নতি করা
                    এবং বিশেষ উৎসব অনুষ্ঠানে শুভেচ্ছা জানানো হয়।
                  </span>
                </Text>
                <Text pt={"3"}>
                  <span style={{ fontWeight: "bold" }}>ক্রমাগত উন্নতি: </span>{" "}
                  <span>
                    নিয়মিতভাবে গ্রাহক প্রতিক্রিয়া মূল্যায়নের মাধ্যমে
                    সামগ্রিকভাবে পরিষেবার মানোন্নয়ন করার প্রতি সচেষ্ট থাকা হয়।
                  </span>
                </Text>

                <Box className="bg-light mt-5">
                  <Text className="text-danger p-1 fw-bold">
                    টু-ফ্যাক্টর অথেন্টিকেশন শর্তাবলি
                  </Text>
                </Box>

                <Box className="my-2">
                  <Text className="p-1 fw-bold">টু-ফ্যাক্টর অথেন্টিকেশন:</Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span>
                    টু-ফ্যাক্টর অথেন্টিকেশন যা টু-স্টেপ ভেরিফিকেশন বা
                    ডুয়েল-ফ্যাক্টর অথেন্টিকেটর নামেও পরিচিত। এটি একটি নিরাপত্তা
                    প্রক্রিয়া যার মাধ্যমে ব্যবহারকারীরা নিজেদের লগিন যাচাই করার
                    জন্য দুটি ভিন্ন যাচাইকরন ফ্যাক্টর প্রদান করে। আমাদের
                    প্ল্যাটফর্ম ও আপনার অ্যাকাউন্টের অতিরিক্ত নিরাপত্তা নিশ্চিত
                    করতে, আমরা টু ফ্যাক্টর অথেনটিকেশন (2FA) পুনরায় অ্যাক্টিভেশন
                    করছি। সংবেদনশীল তথ্য সুরক্ষিত রাখতে এবং আপনার অ্যাকাউন্টে
                    অননুমোদিত অ্যাক্সেস রোধ করতে এটি খুবই গুরুত্বপূর্ণ এবং
                    আবশ্যক৷
                  </span>
                </Text>

                <Box className="my-2">
                  <Text className="p-1 fw-bold">
                    কিভাবে চালু করবেন: <br></br>
                    টু ফ্যাক্টর অথেনটিকেশন সক্রিয়করণের মূল প্রক্রিয়াটি হলোঃ
                  </Text>
                </Box>
                <Text pt={"3"} className="p-1">
                  <span>
                    সিলেক্ট প্রোফাইল &gt; নিউ সিকিউরিটি অপশন &gt; রিকুয়েস্ট
                    ইমেইল ভেরিফিকেশন &gt; ওটিপি সাবমিট &gt; টু-ফ্যাক্টর
                    অথেনটিকেশন সক্রিয় করুন।
                  </span>
                  <div>
                    এই প্রসেসটি আপনার ইমেলটি যাচাই করবে এবং নিশ্চিত করবে যে কোনও
                    অযাচিত অ্যাক্সেসের থেকে আপনার অ্যাকাউন্টটি সুরক্ষিত আছে।
                  </div>
                </Text>
                <Box className="mt-3">
                  <Text className="p-1 fw-bold">ব্যবহারের শর্তাবলী: </Text>
                </Box>
                <div style={{ paddingLeft: "30px" }}>
                  <p>
                    • এজেন্সিগুলিকে তাদের অ্যাকাউন্টের জন্য তাদের ইমেল ভেরিফাই
                    করতে হবে এবং ইমেল অ্যাকাউন্টটিকে অযাচিত অ্যাক্সেস থেকে রক্ষা
                    করার জন্য তাদের পক্ষ থেকে যুক্তিসঙ্গত সুরক্ষা প্রচেষ্টা
                    রয়েছে তা নিশ্চিত করতে হবে।
                  </p>
                  <p>
                    • প্রত্যেক এজেন্সিকে তাদের অ্যাকাউন্টে টু-ফ্যাক্টর
                    অথেনটিকেশন (২এফএ) ফিচারটি সক্রিয় করতে হবে এবং তাদের
                    অ্যাকাউন্টকে সন্দেহজনক লগইন থেকে রক্ষা করতে নিয়মিত ফিচারটি
                    ব্যবহার করতে হবে।
                  </p>
                  <p>
                    • সিকিউরিটি ফলো-আপের জন্য কোথা থেকে লগইন করা হয়েছে তা
                    শনাক্ত করতে এজেন্সিগুলোকে লোকেশন অ্যাকসেস দিতে হবে।
                  </p>
                  <p>
                    • ফিচারগুলো সঠিকভাবে অ্যাক্টিভেট করছে না বা কাজ করছে না এমন
                    বিষয়ে কোনো অভিযোগ থাকলে এজেন্সিকে এক কার্যদিবসের মধ্যে
                    তাদের অ্যাকাউন্ট ম্যানেজারকে জানাতে হবে।
                  </p>
                  <p>
                    • এজেন্সি চাইলে এই ফিচারটি ব্যবহার নাও করতে পারে, তবে
                    সেক্ষেত্রে সুরক্ষা লঙ্ঘন বা তৃতীয় পক্ষের আক্রমণ হলে ট্রাভেল
                    চ্যাম্প কোনও ক্ষতির জন্য দায়বদ্ধ থাকবে না।
                  </p>
                  <p>
                    • ট্রাভেল চ্যাম্প যে কোনো সময় এই শর্তাবলী আপডেট করার অধিকার
                    রাখে। যে কোনো পরিবর্তনের ক্ষেত্রে ট্রাভেল চ্যাম্প আপনাকে
                    ইমেলের মাধ্যমে এবং শর্তাবলী পৃষ্ঠা সংশোধন করে জানিয়ে দেবে।
                  </p>
                  <p>
                    • 2FA কোডগুলির গোপনীয়তা বজায় রাখার জন্য এবং অ্যাকাউন্টের
                    অধীনে ঘটে যাওয়া সমস্ত ক্রিয়াকলাপের জন্য এজেন্সি দায়বদ্ধ।
                    এই বিধান মেনে চলতে এজেন্সির ব্যর্থতা থেকে উদ্ভূত কোনও ক্ষতি
                    বা ক্ষতির জন্য ট্রাভেল চ্যাম্প দায়বদ্ধ নয়।
                  </p>
                </div>
              </Box>
            </Box>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSideModalTC;
