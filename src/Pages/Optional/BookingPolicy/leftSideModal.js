import React, { useState } from "react";
import { Switch, Text } from "@chakra-ui/react";

const LeftSideModal = () => {
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
            <div className="col-lg-12 " pb={"10px"}>
              <Text
                fontWeight={700}
                pb={"10px"}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
                fontSize={"30px"}
              >
                Booking Policy : Triplover Ltd
              </Text>
            </div>

            <Text pt={"3"}>
              In accordance with IATA resolution 850m (Passenger Agency
              Conference Resolutions Manual), given below is the ADM Policy
              which shall be applied by the airlines available on Triplover.
            </Text>

            <Text fontSize={"20px"} style={{ fontWeight: "bold" }} pt={"2"}>
              INTRODUCTION
            </Text>

            <Text>
              An agency debit memo (ADM) is a way for an airline to collect
              money from a travel agent for a mistake or a difference in the
              ticket price. ADMs are also used to adjust or correct the money
              that agents report for the tickets they sell or request. ADMs are
              a common accounting tool for airlines and agents to settle their
              transactions. To reduce the amount of ADM, it is recommended that
              agencies go through the booking policies and the ADM policies of
              the airlines they are ticketing from.
            </Text>

            <Text fontSize={"20px"} style={{ fontWeight: "bold" }} pt={"2"}>
              COMMON BOOKING POLICIES PRACTISED BY AIRLINES
            </Text>
            <Text>
              <span style={{ fontWeight: "bold" }}>1. Churning :</span>{" "}
              <span>
                Segments that are repeatedly cancelled and rebooked to
                circumvent ticketing time limits or to meet GDS productivity are
                considered churning bookings. The threshold for churning
                (repeatedly cancelled and rebooked) is three (3), So, ADM
                charges are applied as of the 04th,{" "}
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                2. Ticketing Time Limits (TTL):{" "}
              </span>{" "}
              <span>
                {" "}
                A date and time deadline will be provided in the PNR, Travel
                agent should either issue a ticket or cancel the booking before
                the TTL. Un-ticketed bookings at the time limit will be
                cancelled by Airlines.{" "}
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                3. Fake/Fictitious Names:{" "}
              </span>{" "}
              <span>
                {" "}
                Booking will be checked to determine if it is with a genuine
                name or a fake/fictitious name. airlines will cancel all
                bookings containing definite fake/fictitious names{" "}
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>4. High cancellation:</span>{" "}
              <span>
                {" "}
                A cancellation rate of more than 60% for international routes
                and 50% for domestic route of the bookings for flights departing
                within the month will be considered as high cancellation.{" "}
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                5. Duplicate Booking: E
              </span>{" "}
              <span>
                {" "}
                Each PNR will be checked for duplicate booking for the same
                passenger and/orsame route and same date. Duplicate un-ticketed
                bookings will be cancelled by the airlines.{" "}
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                6. Inadequate Contact Address:
              </span>{" "}
              <span>
                {" "}
                Passenger's contact address is a mandatory element to create a
                PNR. So, all sorts of contact like Phone no, Mobile no, e-mail
                address etc. of a travel agent as well as a passenger for both
                ends are to be available in the booking. If any important
                information related to the journey could not be communicated
                with the passenger due to inadequacy of contact information, the
                concerned agencies will be held responsible for that.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                7. Impossible Journey:{" "}
              </span>{" "}
              <span>
                {" "}
                Bookings will be checked for segments where the passenger is due
                for departure on the same date but on a different
                route/destination. Airlines will cancel un-ticketed bookings and
                send a warning for ticketed bookings.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                8. Test/ Training PNRs:
              </span>{" "}
              <span>
                {" "}
                Booking will be checked to determine if it is a booking created
                by a travel agent purely for test/training purposes. airlines
                will cancel all test/training bookings.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>9. No-Show: </span>{" "}
              <span>
                A No-Show occurs, when a passenger misses the flight or when a
                travel agent fails to cancel a booking either ticketed or
                un-ticketed but not required by the passenger which eventually
                leads to spoilage of inventory. airlines will cancel all
                subsequent segments followed by the NoShow segment. Requirement
                of cancelling the No-show passenger may vary from 24 to 72 hours
                prior to flight, check with the specific airlines for
                specifications.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                10. Waitlisted Bookings:
              </span>{" "}
              <span>
                Travel agents must cancel and remove all WL/HL segments at least
                72 hours before flight departure, airlines will cancel all
                un-ticketed waitlisted booking 72 hours prior to departure
                including any confirmed segment followed by the waitlisted
                segment.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                11. Minimum Connecting Time (MCT):
              </span>{" "}
              <span>
                Travel agents must not create a booking that violates the MCT
                requirements. airlines will inspect and cancel all un-ticketed
                violations detected bookings and send a warning for ticketed
                bookings
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>12. Duplicate Ticket:</span>{" "}
              <span>
                airlines will check for instances where the same ticket number
                has been used on more than one booking and will send a warning
                to the issuing agent.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                13. Partially Ticketed PNRs:
              </span>{" "}
              <span>
                airlines will check for PNRs with multiple/group names and
                ticket numbers. If tickets have not been issued for all names, a
                warning will be sent to the agent and if no action is observed,
                then airlines will split the PNR and cancel all unticked
                passengers.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>14. Inactive Segments:</span>{" "}
              <span>
                Travel Agents must promptly remove all unwanted segments with
                status codes HX, UN. All inactive segments with the above status
                codes that are not removed 72 hours prior to departure will be
                treated as violations.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>15. APIS Violation:</span>{" "}
              <span>
                It is an IATA mandatory requirement for the following
                information must be included in the PNR for the international
                journey:
                <br />
                <div style={{ paddingLeft: "30px" }}>
                  <p>i. Form of Identification (FOID)</p>
                  <p>ii. Date of Birth (DOB) </p>
                  <p>iii. Gender </p>
                  <p>iv. Others </p>
                  <p>
                    v. airlines will inspect and send a warning for booking with
                    incomplete information and finally missing APIS PNR may also
                    be cancelled.{" "}
                  </p>
                </div>
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>16. Group Bookings:</span>{" "}
              <span>
                Conditions specified in the airline's group contract/policy will
                be audited, if any violation is detected action will be taken
                accordingly.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>17. Hidden Group:</span>{" "}
              <span>
                airlines will also check across multiple individual bookings for
                a large group from the same agent and a warning will be sent to
                the concerned agencies.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>18. Passive Bookings:</span>{" "}
              <span>
                An acceptable passive segment is a segment entered into a GDS
                for the purpose of ticketing and must be cancelled immediately
                after the issuance of a ticket. It must match with an existing
                booking. GDS subscribers must use claim PNR functionality
                instead of passive segments. So, the creation of passive
                segments is not permitted. Industry standards require that
                passive segments be used "for the purpose of ticketing" only
                after a booking has been made in an airline's inventory system.
                Airlines do not allow passive segments to be used for other
                reasons, including the following –<br />
                <div style={{ paddingLeft: "30px" }}>
                  <p>a. To satisfy GDS productivity requirements</p>
                  <p>b. To circumvent fare rules </p>
                </div>
              </span>
            </Text>
            <Text>
              <span style={{ fontWeight: "bold" }}>
                19. Invalid Name Changes:
              </span>{" "}
              <span>
                Name changes are not permitted on reservations unless for the
                purpose of correcting a misspelling of the passenger's name.
                Contact the Central Reservation Control of Airlines for
                assistance with misspellings to avoid cancellation of space.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>20. Coupon Sequence:</span>{" "}
              <span>
                The passenger must travel as per sequence of coupon and
                itineraries shown in his ticket. Sequence break journey is
                strongly prohibited by Airlines.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>21. Proper Ticket:</span>{" "}
              <span>
                Travel Agents must not issue a single sector ticket against a
                return sector booking for a visit visa passenger.
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                22. OD or POC Violation:
              </span>{" "}
              <span>
                Booking and ticketing will be as per the available dedicated RBD
                that has been assigned by the airline for a selected OD
                according to the sequence of the journey. However, any
                manipulation of the segments in a booking to bypass the OD
                availability to gain access to a lower booking class is
                considered an OD or POC violation. For example: In Emirates
                Airlines. A flight from Dhaka (DAC) to Singapore (SIN) via Dubai
                (DXB) is booked and the DXB-SIN segment is cancelled will be
                treated as OD or POC violation and the agency will be sent an
                ADM by the airlines.
              </span>
            </Text>

            <Text pt={"40px"}>
              Even without the reasons specified above, an Agency debit memo
              (ADM) can be issued by airlines in case of policy violations by
              the agency. Please adhere to the specific airline booking policy
              to avoid ADMs.
            </Text>

            <Text pt={1}>
              Any ADM received by an agency is the sole responsibility of the
              agent. Triplover will not take any responsibility for any
              bookings made by the agents.
            </Text>
          </>
        ) : (
          <>
            <div className="col-lg-12 " pb={"10px"}>
              <Text
                fontWeight={700}
                pb={"10px"}
                display={"flex"}
                justifyContent={"start"}
                alignItems={"center"}
                fontSize={"30px"}
              >
                এডিএম গাইড : ট্রাভেল চ্যাম্প লিমিটেড
              </Text>
            </div>

            <Text pt={"3"}>
              IATA রেজোলিউশন 850m (Passenger Agency Conference Resolutions
              Manual) অনুযায়ী, নীচে প্রদত্ত এডিএম পলিসি ট্রাভেল চ্যাম্প এর সাথে
              চুক্তিবদ্ধ এয়ারলাইন্সগুলো প্রয়োগ করার অধিকার রাখে।
            </Text>

            <Text fontSize={"20px"} style={{ fontWeight: "bold" }} pt={"2"}>
              ADM পরিচিতিঃ
            </Text>

            <Text>
              যেকোনো ভুল, বুকিং ভায়োলেশন বা টিকিটের মূল্যের পার্থক্যের জন্য
              ট্রাভেল এজেন্টের কাছ থেকে এয়ারলাইনের পক্ষ হতে অর্থ আদায় করার
              দালিলিক উপায়কে এজেন্সি ডেবিট মেমো বা এডিএম (ADM) বলে। এজেন্টরা যে
              টিকিট বিক্রি করে বা বুক করে এর বিপরীতে রিপোর্ট করা অর্থের পরিমাণে
              কোনো অসামঞ্জস্য থাকলে তা সংশোধন করতেও এডিএম ব্যবহৃত হয়। এই
              অ্যাকাউন্টিং টুলটি এয়ারলাইন এবং এজেন্টদের লেনদেন নিষ্পত্তি করার
              একটি মাধ্যম। এডিএম-এর মাধ্যমে জরিমানার পরিমাণ কমাতে, একটি
              এজেন্সিকে এয়ারলাইনগুলোর বুকিং পলিসি ভালোভাবে বুঝে সেই অনুযায়ী
              টিকেট কাটতে হবে।
            </Text>

            <Text fontSize={"20px"} style={{ fontWeight: "bold" }} pt={"2"}>
              এয়ারলাইনগুলো সাধারণত যে সকল বুকিং পলিসি মেনে চলতে বলেঃ
            </Text>
            <Text>
              <span style={{ fontWeight: "bold" }}>1. চার্নিং :</span>{" "}
              <span>
                টিকেটিং টাইম লিমিট বাড়ানোর জন্য বা GDS প্রোডাক্টিভিটি কোটা
                পূরণের জন্য অথবা অন্য কোনো কারণে বারবার বুকিং এবং ক্যান্সেল করলে
                তাকে চার্নিং বুকিং হিসেবে বিবেচনা করা হয়। ৩ বারের বেশি চার্নিং
                (বুকিং ক্যান্সেল করে পুনরায় ধরা) করলে চতুর্থ বা তার বেশি বারের
                ক্ষেত্রে এয়ারলাইন এডিএম চার্জ করতে পারে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                2. টিকেটিং টাইম লিমিট(TTL):
              </span>{" "}
              <span>
                PNR-এ উল্লেখ করা তারিখ এবং সময়সীমার ভেতরে ট্রাভেল এজেন্টকে
                টিকিট ইস্যু করতে হবে অথবা টাইম লিমিট শেষ হবার আগে টিকেটের বুকিং
                বাতিল করতে হবে। সময় সীমা অতিক্রম হয়ে গেলে এয়ারলাইন বুকিং বাতিল
                করে দেবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>3. জাল/কাল্পনিক নাম: </span>{" "}
              <span>
                বুকিংটি আসল নাম নাকি জাল/কাল্পনিক নাম দিয়ে করা তা নির্ধারণ করতে
                এয়ারলাইন্ চেক করে থাকে। এয়ারলাইনগুলি নির্দিষ্ট জাল/কাল্পনিক নাম
                ধারণকারী সমস্ত বুকিং বাতিল করবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                4. অতিরিক্ত বুকিং ক্যান্সেলেশন:
              </span>{" "}
              <span>
                আন্তর্জাতিক রুটের জন্য 60% এর বেশি এবং অভ্যন্তরীণ রুটের ফ্লাইটের
                50% এর বেশি বুকিং ক্যান্সেলেশনকে “মাত্রাতিরিক্ত ক্যান্সেলেশন”
                বিবেচনা করা হবে এবং সেক্ষেত্রে এয়ারলাইন এডিএম পাঠাতে পারে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>5. ডুপ্লিকেট বুকিং:</span>{" "}
              <span>
                প্রতিটি PNR একই যাত্রী এবং/অথবা একই রুট এবং একই তারিখের জন্য
                ডুপ্লিকেট বুকিংয়ের জন্য চেক করা হবে। যে সকল ডুপ্লিকেট বুকিংএর
                বিপরীতে টিকেট কাটা হয়নি সেগুলো এয়ারলাইন বাতিল করে দেবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                6. অপর্যাপ্ত যোগাযোগের ঠিকানা:
              </span>{" "}
              <span>
                PNR তৈরি করার জন্য যাত্রীর যোগাযোগের ঠিকানা দেয়া বাধ্যতামূলক ।
                ট্র্যাভেল এজেন্ট এবং প্যাসেঞ্জারের ফোন নম্বর, মোবাইল নম্বর,
                ই-মেইল ঠিকানা ইত্যাদি তথ্য বুকিং এর সাথে থাকা আবশ্যক। যোগাযোগের
                তথ্যের অপর্যাপ্ততার কারণে যাত্রা সংক্রান্ত কোনো গুরুত্বপূর্ণ
                প্রয়োজনে যাত্রীর সাথে যোগাযোগ করা সম্ভব না হলে তার জন্য
                সংশ্লিষ্ট এজেন্সি দায়ী থাকবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                7. পরীক্ষামূলক/প্রশিক্ষণ PNR:{" "}
              </span>{" "}
              <span>
                পরীক্ষামূলকভাবে বা প্রশিক্ষণের উদ্দেশ্যে ট্রাভেল এজেন্ট কোনো
                বুকিং করেছে কিনা তা চেক করা হয়। এয়ারলাইন সমস্ত
                পরীক্ষামূলক/প্রশিক্ষণ বুকিং বাতিল করবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>8. নো-শো: </span>{" "}
              <span>
                যখন কোনও যাত্রী ফ্লাইট মিস করেন, বা যখন কোনও ট্র্যাভেল এজেন্ট
                টিকিট কাটার পর যাত্রীর অপ্রয়োজনীয় টিকিট ক্যান্সেল করতে ব্যর্থ হন
                এবং ফ্লাইট ছেড়ে যায় সে ক্ষেত্রে এটি নো-শো হিসেবে বিবেচিত হবে।
                নো-শো বিমানের সিট ইনভেন্টরি নষ্ট করে। এয়ারলাইন্স এক্ষেত্রে
                নো-শো সেগমেন্ট এর পরের সমস্ত সেগমেন্ট বাতিল করবে। যে যাত্রী যাবে
                না তার টিকেট এয়ারলাইন ভেদে ২৪ বা ৭২ ঘণ্টা আগে বাতিল করার প্রয়োজন
                হতে পারে। নির্দিষ্ট এয়ারলাইনের পলিসি অনুসরণ করে পদক্ষেপ নিতে
                হবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>9. ওয়েটলিস্টের বুকিং:</span>{" "}
              <span>
                ট্রাভেল এজেন্টদের অবশ্যই ফ্লাইট ছাড়ার কমপক্ষে 72 ঘণ্টা আগে
                সমস্ত WL/HL সেগমেন্ট বাতিল করে সরিয়ে ফেলতে হবে। নতুবা এয়ারলাইন
                72 ঘণ্টা আগে সমস্ত টিকিট-বিহীন ওয়েটলিস্টেড বুকিং বাতিল করবে এবং
                এর পরবর্তী সকল কনফার্মড সেগমেন্টও বাতিল করে দেবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                10. মিনিমাম কানেক্টিং টাইম (MCT):
              </span>{" "}
              <span>
                ট্রাভেল এজেন্টদের অবশ্যই মিনিমাম কানেক্টিং টাইম (একজন যাত্রীর
                কানেক্টিং ফ্লাইট থাকলে পরবর্তী ফ্লাইটে ওঠার জন্য যে সময় হাতে
                রাখা আবশ্যক) রেখে বুকিং তৈরি করতে হবে। MCT না রেখে করা বুকিংগুলি
                এয়ারলাইন বাতিল করে দেবে এবং ট্রাভেল এজেন্টকে ওয়ার্নিং পাঠাবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>11. ডুপ্লিকেট টিকেট:</span>{" "}
              <span>
                এয়ারলাইনগুলি এমন পিএনআরগুলো চেক করবে যেখানে একই টিকিট নম্বর
                একাধিক বুকিংয়ে ব্যবহার করা হয়েছে এবং ইস্যুকারী এজেন্টকে একটি
                সতর্কবার্তা পাঠানো হবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                12. পার্শিয়ালি টিকেটেড PNR:
              </span>{" "}
              <span>
                একাধিক প্যাসেঞ্জারযুক্ত PNR এ যদি সব নামের জন্য টিকিট ইস্যু করা
                না হয়, তাহলে এজেন্টকে একটি সতর্কবার্তা পাঠানো হবে এবং এরপরও
                কোনো পদক্ষেপ না নিলে, এয়ারলাইন PNR স্প্লিট করে টিকেট ইস্যু না
                হওয়া সমস্ত যাত্রীদের বুকিং বাতিল করে দেবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>13. ইনএক্টিভ সেগমেন্ট:</span>{" "}
              <span>
                ট্র্যাভেল এজেন্টদের অবশ্যই স্ট্যাটাস কোড HX, UN সহ সমস্ত
                অবাঞ্ছিত সেগমেন্টগুলো সরিয়ে ফেলতে হবে। উপরোক্ত স্ট্যাটাস কোড সহ
                সমস্ত ইনএক্টিভ সেগমেন্ট যদি ফ্লাইট ছাড়ার 72 ঘণ্টার আগে সরানো হয়
                না হয় তবে তা ভায়োলেশন হিসাবে বিবেচিত হবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>14. APIS ভায়োলেশন:</span>{" "}
              <span>
                IATA প্রদত্ত নীতিমালা অনুসারে Advance Passenger Information
                System (APIS) সংরক্ষণের জন্য আন্তর্জাতিক যাত্রার ক্ষেত্রে PNR-এ
                নিম্নলিখিত তথ্যগুলি অবশ্যই অন্তর্ভুক্ত করতে হবে:
                <br />
                <div style={{ paddingLeft: "30px" }}>
                  <p>- আইডেন্টিফিকেশন ফর্ম (FOID) </p>
                  <p>- জন্ম তারিখ (DOB) </p>
                  <p>- লিঙ্গ। </p>
                  <p>- অন্যান্য। </p>
                  <p>
                    - এয়ারলাইনগুলি অসম্পূর্ণ তথ্য সহ বুকিংয়ের জন্য একটি
                    সতর্কতা পাঠাবে এবং API (Advance Passenger Information) না
                    থাকলে PNR বাতিল করা হতে পারে।
                  </p>
                </div>
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>15. গ্রুপ বুকিং:</span>{" "}
              <span>
                গ্রুপ বুকিংগুলি এয়ারলাইনের নির্দিষ্ট পলিসি অনুসারে অডিট করা হবে,
                কোনো লঙ্ঘন ধরা পড়লে সেই অনুযায়ী ব্যবস্থা নেওয়া হবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                16. গ্রুপ গোপন করে বুকিং করলে:
              </span>{" "}
              <span>
                এজেন্ট যদি কয়েকটি ছোট ছোট বুকিং এর মাধ্যমে গ্রুপ পাঠাতে চেষ্টা
                করে তা চেক করে এয়ারলাইন দায়ী এজেন্সিকে সতর্কবার্তা পাঠাবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>17. প্যাসিভ বুকিং:</span>{" "}
              <span>
                শুধুমাত্র টিকেট ইস্যুর সুবিধার্থে যদি প্যাসিভ সেগমেন্ট তৈরি করা
                হয় এবং টিকেট কাটার সাথে সাথে ক্যান্সেল করে দেয়া হয়, তবেই প্যাসিভ
                সেগমেন্ট গ্রহণযোগ্য। জিডিএস এর প্রোডাক্টিভিটি কোটা পূরণ বা ফেয়ার
                রুল এড়িয়ে টিকেট কাটার জন্য প্যাসিভ সেগমেন্ট ব্যবহারের অনুমতি
                নেই। <br />
              </span>
            </Text>
            <Text>
              <span style={{ fontWeight: "bold" }}>18. নাম পরিবর্তন:</span>{" "}
              <span>
                যাত্রীর নামের ভুল বানান সংশোধনের উদ্দেশ্যে ছাড়া অন্য কারণে
                রিজার্ভেশনে নাম পরিবর্তন অনুমোদিত নয়। সিট ক্যান্সেলেশন এড়াতে
                ভুল বানান সংশোধনে সহায়তার জন্য এয়ারলাইনের সেন্ট্রাল রিজার্ভেশন
                কন্ট্রোলের সাথে যোগাযোগ করুন।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>19. কুপন সিকোয়েন্স:</span>{" "}
              <span>
                যাত্রীকে অবশ্যই তার টিকিটে দেখানো যাত্রাপথের ক্রম অনুসারে ভ্রমণ
                করতে হবে। সিকোয়েন্স ব্রেক যাত্রা এয়ারলাইন্স দ্বারা দৃঢ়ভাবে
                নিষিদ্ধ।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>20. সঠিক টিকিট:</span>{" "}
              <span>
                ভিজিট ভিসা-ধারী যাত্রীদের রিটার্ন টিকিট বুকিং করে শুধুমাত্র একটি
                সেগমেন্টের বিপরীতে টিকেট ইস্যু করা যাবে না।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                21. ওডি ভায়োলেশন ও পিওসি ভায়োলেশন:
              </span>{" "}
              <span>
                নির্দিষ্ট অরিজিন এবং ডেস্টিনেশনের জন্য যাত্রার সিকোয়েন্স অনুসারে
                এয়ারলাইন যে আরবিডি নির্ধারণ করে দেবে সেই অনুসারে বুকিং ও টিকেটিং
                করতে হবে। অরিজিন ডেস্টিনেশন বাইপাস করে নির্ধারিত ফেয়ারের থেকে কম
                ফেয়ার ক্লাস বুক করার জন্য সেগমেন্ট ম্যানিপুলেট করে বুকিং করলে তা
                ওডি ও পিওসি ভায়োলেশন বিবেচিত হবে। যেমন, যে Dac-Sin ফ্লাইট DXB
                ঘুরে যায়, সেটি বুকিং করে DXB-SIN সেগমেন্ট ক্যান্সেল করলে OD এবং
                POC ভায়োলেশন হবে এবং এয়ারলাইন এজেন্সিকে এডিএম পাঠাবে।
              </span>
            </Text>

            <Text>
              <span style={{ fontWeight: "bold" }}>
                22. পিএনআর রেসস্ট্রিকশন:
              </span>{" "}
              <span>
                ফেয়ারের পার্থক্য বা এক্সচেঞ্জ রেটের সুবিধা নিতে বা অন্য কোনো
                কারনে দেশের বাইরের ট্রাভেল এজেন্সির পিসিসি থেকে পিএনআর শেয়ার করা
                দৃঢ়ভাবে নিষিদ্ধ। এ ধরনের বুকিং এর কারনে আসা সকল এডিএম এর জন্য
                এজেন্সি দায়বদ্ধ থাকবে।
              </span>
            </Text>

            <Text pt={"40px"}>
              উপরে উল্লিখিত কারণ ছাড়াও এয়ারলাইন তাদের পলিসি ভায়োলেশনের জন্য
              এজেন্সিকে ADM পাঠাতে পারে। ADM এড়াতে অনুগ্রহ করে নির্দিষ্ট
              এয়ারলাইনের বুকিং নীতি মেনে চলুন।
            </Text>

            <Text pt={1}>
              কোনো এজেন্সি বুকিং বা টিকেটিং এর জন্য ADM পেলে সেটি শুধুমাত্র
              এজেন্টের দায়িত্ব। এজেন্টদের করা বুকিংয়ের জন্য ট্রাভেল চ্যাম্প
              কোনো দায়-দায়িত্ব নেবে না।
            </Text>
          </>
        )}
      </div>
    </div>
  );
};

export default LeftSideModal;
