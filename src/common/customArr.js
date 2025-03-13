import { IoBagHandle } from "react-icons/io5";
import { GiHotMeal } from "react-icons/gi";
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { GiWaterRecycling } from "react-icons/gi";
import { GoMilestone } from "react-icons/go";
import { TbBrandBooking } from "react-icons/tb";

export const brandedFareTitleList = [
    {
        propertyValue :"HandBaggage",
        name : "Hand Baggage",
        icon : <IoBagHandle />
    },
    {
        propertyValue :"CheckedBaggage",
        name : "Checked Baggage",
        icon : <i class="fas fa-luggage-cart"></i>
    },
    // {
    //     propertyValue :"Meal",
    //     name : "Meal",
    //     icon : <GiHotMeal/>
    // },
    // {
    //     propertyValue :"SeatSelection",
    //     name : "Seat Selection",
    //     icon : <MdAirlineSeatReclineNormal/>
    // },
    {
        propertyValue :"Changeable",
        name : "Rebooking",
        icon : <i class="fa fa-calendar" aria-hidden="true"></i>
    },
    {
        propertyValue :"Refundable",
        name : "Cancellation",
        icon : <GiWaterRecycling/>
    },
    // {
    //     propertyValue :"Miles",
    //     name : "Miles",
    //     icon : <GoMilestone/>
    // },
    {
        propertyValue :"BookingClass",
        name : "Booking Class",
        icon : <TbBrandBooking/>
    }
]