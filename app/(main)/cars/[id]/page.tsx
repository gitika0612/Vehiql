import React from "react";

interface Params {
    id: string;
}

const CarsPage = ({ params }: { params: Params }) => {
    const { id } = params;

    return (
        <div>
            CarPage: {id}
        </div>
    );
};

export default CarsPage;
