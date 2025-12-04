import React, { useEffect, useState, useMemo } from 'react';

// Constants for pagination
const ROWS_PER_PAGE = 10;
const API_URL = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

// Simple inline styles (no external CSS or UI libraries allowed)
const appStyles = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
};

const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
};

const thTdStyles = {
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left',
    // 💡 Add explicit text color for data cells to ensure visibility on various backgrounds
    color: '#333', 
};

const thStyles = {
    ...thTdStyles,
    // Slightly darker blue for better contrast
    backgroundColor: '#2c3e50', 
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
};

const buttonGroupStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
};

const buttonBaseStyles = {
    padding: '10px 15px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#fff',
    transition: 'background-color 0.2s',
    color: '#333', // Ensure button text is visible
};

const buttonActiveStyles = {
    ...buttonBaseStyles,
    // Match the dark header color for a cohesive look
    backgroundColor: '#2c3e50',
    color: 'white',
    border: '1px solid #2c3e50',
};

const buttonDisabledStyles = {
    ...buttonBaseStyles,
    cursor: 'not-allowed',
    opacity: 0.5,
};

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // --- Data Fetching with Error Handling ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error("Fetching error:", err);
                // 💡 Requirement: In case of failure, display 'failed to fetch data'
                setError('failed to fetch data'); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- Pagination Calculations ---
    const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

    // Memoize the data slice to only recalculate when data or page changes
    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage]);

    // --- Handlers for Pagination Buttons ---
    const handleNext = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePrevious = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    // --- Render Logic ---

    if (loading) {
        return <div style={appStyles}>Loading data...</div>;
    }

    if (error) {
        // Display error message
        return <div style={{ ...appStyles, color: 'red', fontWeight: 'bold' }}>{error}</div>;
    }

    return (
        <div style={appStyles}>
            <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>Employee Administration Panel</h1>

            {/* Employee Data Table */}
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={thStyles}>ID</th>
                        <th style={thStyles}>Name</th>
                        <th style={thStyles}>Email</th>
                        <th style={thStyles}>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((employee, index) => (
                        <tr 
                            key={employee.id} 
                            // 💡 Use contrasting background colors for rows
                            style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'white' }}
                        >
                            <td style={thTdStyles}>{employee.id}</td>
                            <td style={thTdStyles}>{employee.name}</td>
                            <td style={thTdStyles}>{employee.email}</td>
                            <td style={thTdStyles}>{employee.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div style={buttonGroupStyles}>
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={currentPage === 1 ? buttonDisabledStyles : buttonBaseStyles}
                >
                    Previous
                </button>

                <span style={{ margin: '0 10px', fontSize: '18px', color: '#333' }}>
                    Page **{currentPage}** of **{totalPages}**
                </span>
                
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    style={currentPage === totalPages ? buttonDisabledStyles : buttonBaseStyles}
                >
                    Next
                </button>
            </div>
            
             <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
                Displaying {currentData.length} rows. Total employees: {data.length}
            </p>
        </div>
    );
}

export default App;