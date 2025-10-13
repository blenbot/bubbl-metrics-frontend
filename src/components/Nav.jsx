import React, { useState } from 'react';
import '../index.css';
import Bubbl from '../assets/Bubbl.png';
import { metricsAPI } from '../services/api';

export default function Nav() {
    const [loading, setLoading] = useState(false);
    const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);

    const handleDownloadCSV = async () => {
        try {
            setLoading(true);
            const blob = await metricsAPI.generateRewardsCSV();
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rewards_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            alert('✅ CSV downloaded successfully!');
        } catch (error) {
            console.error('Error downloading CSV:', error);
            alert('❌ Failed to download CSV: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateGoogleSheet = async () => {
        try {
            setLoading(true);
            const result = await metricsAPI.updateGoogleSheet();
            
            if (result.sheet_url) {
                window.open(result.sheet_url, '_blank');
                alert('✅ Google Sheet updated successfully!');
            } else {
                alert('✅ Google Sheet updated!');
            }
        } catch (error) {
            console.error('Error updating Google Sheet:', error);
            alert('❌ Failed to update Google Sheet: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePublicGoogleSheet = async () => {
        try {
            setLoading(true);
            const result = await metricsAPI.updatePublicGoogleSheet();
            
            if (result.sheet_url) {
                window.open(result.sheet_url, '_blank');
                alert('✅ Public Google Sheet updated successfully!');
            } else {
                alert('✅ Public Google Sheet updated!');
            }
        } catch (error) {
            console.error('Error updating Public Google Sheet:', error);
            alert('❌ Failed to update Public Google Sheet: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <nav className='z-15 fixed top-10 left-15 right-15 shadow-md bg-orange-400 rounded-xl py-3 px-6 md:px-8 lg:px-12 font-white font-[700]'>
                <div className='flex justify-between items-center gap-x-7 max-w-7xl mx-auto'>
                    <div className='flex items-center gap-x-3'>
                        <img src={Bubbl} alt="bubbl-logo" className="h-8 w-8" />
                        <span className='text-xl text-gray-800'>Bubbl Metrics</span>
                    </div>
                    
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={handleDownloadCSV}
                            disabled={loading}
                            className='px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            <span>📥</span>
                            <span className='hidden md:inline'>Download CSV</span>
                        </button>
                        
                        <button
                            onClick={handleUpdateGoogleSheet}
                            disabled={loading}
                            className='px-4 py-2 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            <span>📊</span>
                            <span className='hidden md:inline'>Update Sheet</span>
                        </button>
                        
                        <button
                            onClick={handleUpdatePublicGoogleSheet}
                            disabled={loading}
                            className='px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            <span>🌐</span>
                            <span className='hidden md:inline'>Public Sheet</span>
                        </button>
                        
                        <button
                            onClick={() => setShowMarkPaidModal(true)}
                            disabled={loading}
                            className='px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            <span>✅</span>
                            <span className='hidden md:inline'>Mark Paid</span>
                        </button>
                    </div>
                </div>
            </nav>

            {showMarkPaidModal && (
                <MarkPaidModal 
                    onClose={() => setShowMarkPaidModal(false)}
                />
            )}
        </>
    );
}

function MarkPaidModal({ onClose }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate phone number
        if (!phoneNumber.startsWith('+')) {
            alert('❌ Phone number must include country code (e.g., +1)');
            return;
        }

        if (phoneNumber.length < 10) {
            alert('❌ Please enter a valid phone number');
            return;
        }

        try {
            setLoading(true);
            await metricsAPI.markAmbassadorPaid(phoneNumber, note);
            alert('✅ Ambassador marked as paid successfully!');
            onClose();
        } catch (error) {
            console.error('Error marking as paid:', error);
            alert('❌ Failed to mark as paid: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl'>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800'>Mark Ambassador as Paid</h2>
                    <button 
                        onClick={onClose}
                        className='text-gray-500 hover:text-gray-700 text-2xl'
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 font-semibold mb-2'>
                            Phone Number (with country code)
                        </label>
                        <input
                            type='tel'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder='+1234567890'
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
                            required
                        />
                        <p className='text-sm text-gray-500 mt-1'>
                            Example: +1 for USA, +44 for UK
                        </p>
                    </div>

                    <div className='mb-6'>
                        <label className='block text-gray-700 font-semibold mb-2'>
                            Note (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder='Add any additional notes...'
                            rows={3}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400'
                        />
                    </div>

                    <div className='flex gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={loading}
                            className='flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Processing...' : 'Mark as Paid'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}