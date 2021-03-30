import {Circle} from "better-react-spinkit"

function Loading() {
    return (
        <center
            style={{
                display: "grid",
                placeItems: "center",
                height: "100vh"
            }}
        >
            <div>
                <img
                    src="https://i.pinimg.com/originals/79/dc/31/79dc31280371b8ffbe56ec656418e122.png"
                    alt=""
                    height={200}
                    style={{
                        marginBottom: 10
                    }}
                />

                <Circle
                    color="#3CBC28"
                    size={60}
                />
            </div>
        </center>
    )
}

export default Loading
