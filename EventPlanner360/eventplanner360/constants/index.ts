export const headerLinks = [
    {
        label: "Home",
        route: "/",
    },
    {
        label: "Create Event",
        route: "/events/create",
    },
    {
        label: "Profile",
        route: "/profile",
    },
];

export const eventDefaultValues = {
    title: "",
    description: "",
    imageUrl: "",
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: "",
    location: "",
    price: "",
    isFree: "",
    url: "",
};
