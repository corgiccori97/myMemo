import { useState } from 'react';

function Home() {
    const [isMember, SetIsMember] = useState("false");
    return (
        <>
        { isMember ? (
            null
        ) : (
            <>
            게시판
            </>
        )}
        </>
    );
}

export default Home;