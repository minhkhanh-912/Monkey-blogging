import React from 'react';
import styled from 'styled-components';

const LoadingStyles = styled.div`
    width: ${props => props.size};
    height: ${props => props.size};
    border: ${props => props.bodersize} solid white;
    border-top: ${props => props.bodersize} solid transparent;
    border-bottom: ${props => props.bodersize} solid transparent;
    border-radius: 100%;
    display: inline-block;
    animation:  Spinner 1s infinite linear;
    @keyframes Spinner {
        100%{
            transform: rotate(360deg);
        }
    }
`

const LoadingSpinner = () => {
    return (
        <LoadingStyles size="3rem" bodersize="0.5rem">
        </LoadingStyles>
    );
};

export default LoadingSpinner;