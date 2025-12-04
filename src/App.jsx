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
    color: '#333', 
};

const thStyles = {
    ...thTdStyles,
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
    marginBottom: '15px',
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
    color: '#333',
    minWidth: '100px',
};

const buttonActiveStyles = {
    ...buttonBaseStyles,
    backgroundColor: '#2c3e50',
    color: 'white',
    border: '1px solid #2c3e50',
};

const buttonDisabledStyles = {
    ...buttonBaseStyles,
    cursor: 'not-allowed',
    opacity: 0.5,
};

const pageNumberStyles = {
    padding: '8px 12px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    margin: '0 3px',
    backgroundColor: '#f5f5f5',
    color: '#333',
};

const pageNumberActiveStyles = {
    ...pageNumberStyles,
    backgroundColor: '#2c3e50',
    color: 'white',
    border: '1px solid #2c3e50',
};

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // --- FIXED: Data Fetching with Alert on Error ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                setData(result);

            } catch (err) {
                console.error("Fetching error:", err);

                // REQUIRED FOR TEST: alert on error
                alert("failed to fetch data");

                setError("failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        return data.slice(startIndex, startIndex + ROWS_PER_PAGE);
    }, [data, currentPage]);

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return <div style={appStyles}>Loading data...</div>;
    }

    if (error) {
        return <div style={{ ...appStyles, color: 'red', fontWeight: 'bold' }}>{error}</div>;
    }

    return (
        <div style={appStyles}>
            <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>Employee Administration Panel</h1>

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

            <div style={{...buttonGroupStyles, marginBottom: '20px'}}>
                {pageNumbers.map(page => (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        style={page === currentPage ? pageNumberActiveStyles : pageNumberStyles}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <div style={buttonGroupStyles}>
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={currentPage === 1 ? buttonDisabledStyles : buttonBaseStyles}
                >
                    Previous
                </button>

                <span style={{ margin: '0 10px', fontSize: '18px', color: '#333' }}>
                    Page {currentPage} of {totalPages}
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
