import React, { useState, useEffect } from 'react';

const SIZE = 20;
export const Cursor = ({ selectedColor }: { selectedColor?: string }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (<>
        {selectedColor && <div
            style={{
                position: 'absolute',
                top: position.y - SIZE - 5,
                left: position.x - SIZE - 5,
                width: SIZE,
                height: SIZE,
                backgroundColor: selectedColor,
                border: '1px solid black',
                zIndex: 9999,
            }}
        />}
    </>);
};
