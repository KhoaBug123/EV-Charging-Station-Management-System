/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import useStationStore from '../../../store/stationStore';
import useBookingStore from '../../../store/bookingStore';
import './QRCodeScanner.css';

const QRCodeScanner = ({ onScanSuccess, onClose }) => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  
  const { getStationById } = useStationStore();
  const { createBooking } = useBookingStore();

  // Request camera permission on component mount
  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        // Stop the stream immediately as QrReader will handle it
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setHasPermission(false);
        setError('Không thể truy cập camera. Vui lòng cho phép truy cập camera.');
      }
    };

    requestCameraPermission();
  }, []);

  const handleScan = async (result, error) => {
    if (result) {
      try {
        const qrData = result?.text || result;
        console.log('QR Code scanned:', qrData);
        
        // Parse QR data (expected format: STATION:ST001:PORT:A01 or JSON)
        let stationId, portId;
        try {
          const parsed = JSON.parse(qrData);
          stationId = parsed.stationId;
          portId = parsed.portId;
        } catch {
          const parts = qrData.split(':');
          stationId = parts[1];
          portId = parts[3];
        }

        if (!stationId || !portId) {
          throw new Error('Mã QR không hợp lệ');
        }

        // Get station details
        const station = getStationById(stationId);
        if (!station) {
          throw new Error('Không tìm thấy trạm sạc');
        }
          
          // Create booking via API
          const bookingResult = await createBooking({
            stationId: station.id,
            stationName: station.name,
            chargerType: {
              id: 'auto',
              name: 'Auto-selected',
              power: `${station.charging.maxPower} kW`,
              price: `${station.charging.pricing.dcRate || station.charging.pricing.acRate} VNĐ/kWh`,
            },
            connector: {
              id: 'auto',
              name: 'Auto-detected',
              compatible: 'Universal',
            },
            slot: {
              id: portId,
              location: `Port ${portId}`,
            },
            bookingTime: new Date().toISOString(),
            scannedAt: new Date().toISOString(),
            autoStart: true,
            schedulingType: 'qr_immediate', // Special case: QR scan for immediate charging (not pre-scheduled)
            source: 'qr_scan'
          });

          if (bookingResult.success && onScanSuccess) {
            onScanSuccess({
              station,
              booking: bookingResult.booking,
              portId,
              message: 'Đã quét mã QR thành công'
            });
          } else if (!bookingResult.success) {
            throw new Error(bookingResult.error || 'Không thể tạo booking');
          }
      } catch (err) {
        console.error('QR Scan Error:', err);
        setError(err.message || 'Không thể xử lý mã QR. Vui lòng thử lại.');
      }
      setScanning(false);
    }

    if (error) {
      console.warn('QR Scanner error:', error);
    }
  };

  const handleStationFound = (station, portId) => {
    // Check station availability
    if (station.status !== 'active') {
      setError('Trạm sạc hiện không hoạt động.');
      return;
    }

    if (station.charging.availablePorts <= 0) {
      setError('Trạm sạc hiện không có cổng trống.');
      return;
    }

    // Auto-create booking for scanned station
    const bookingData = {
      stationId: station.id,
      stationName: station.name,
      chargerType: {
        id: 'auto',
        name: 'Tự động',
        power: `${station.charging.maxPower} kW`,
        price: `${station.charging.pricing.dcRate || station.charging.pricing.acRate} VNĐ/kWh`,
      },
      connector: {
        id: station.charging.connectorTypes[0]?.replace(' ', '_').toLowerCase() || 'auto',
        name: station.charging.connectorTypes[0] || 'Tự động',
        compatible: 'Tương thích',
      },
      slot: {
        id: portId,
        location: `Port ${portId}`,
      },
      bookingTime: new Date().toISOString(),
      scannedAt: new Date().toISOString(),
      autoStart: true, // Flag to indicate this was started via QR scan
    };

    const booking = createBooking(bookingData);
    
    if (onScanSuccess) {
      onScanSuccess({
        station,
        booking,
        portId,
        message: 'Quét QR thành công! Đang khởi tạo phiên sạc...'
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    setScanning(true);
  };

  if (hasPermission === false) {
    return (
      <div className="qr-scanner-container">
        <div className="qr-scanner-modal">
          <div className="qr-scanner-header">
            <h3>Quét mã QR trạm sạc</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="qr-scanner-error">
            <div className="error-icon">📷</div>
            <p>Không thể truy cập camera</p>
            <p className="error-detail">
              Vui lòng cho phép truy cập camera trong trình duyệt để sử dụng tính năng quét QR.
            </p>
            <button className="retry-btn" onClick={handleRetry}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-scanner-container">
      <div className="qr-scanner-modal">
        <div className="qr-scanner-header">
          <h3>Quét mã QR trạm sạc</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="qr-scanner-content">
          {scanning && hasPermission && !error && (
            <div className="scanner-wrapper">
              <QrReader
                onResult={handleScan}
                style={{ width: '100%' }}
                constraints={{
                  video: {
                    facingMode: 'environment' // Use back camera
                  }
                }}
              />
              <div className="scanner-overlay">
                <div className="scanner-frame">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
                <p className="scanner-instruction">
                  Hướng camera vào mã QR trên trạm sạc
                </p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="qr-scanner-error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button className="retry-btn" onClick={handleRetry}>
                Quét lại
              </button>
            </div>
          )}
        </div>
        
        <div className="qr-scanner-footer">
          <p className="scanner-help">
            💡 Mẹo: Đảm bảo mã QR trong khung và có đủ ánh sáng
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;