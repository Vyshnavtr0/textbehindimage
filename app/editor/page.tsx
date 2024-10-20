'use client';

import { Slider } from '@/components/ui/slider';
import React, { useState, useRef, useEffect ,useCallback} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { removeBackground } from "@imgly/background-removal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Trash2, Copy, Upload, Download, Plus,ZoomIn,Droplet, ZoomOut, Undo, Redo, Sliders,CircleDot, RotateCw } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { initializeApp } from 'firebase/app';

// Firebase configuration (make sure this matches your config in landing.tsx)
const firebaseConfig = {
  apiKey: "AIzaSyA-ag9BCwGhFEsuAQSeG7MVis98xUhYJBU",
  authDomain: "textinsideimage.firebaseapp.com",
  projectId: "textinsideimage",
  storageBucket: "textinsideimage.appspot.com",
  messagingSenderId: "558991178680",
  appId: "1:558991178680:web:959c2d6736ec94452d6d4d",
  measurementId: "G-8QBQY4PZ14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}
interface GoogleFont {
  family: string;
  // Add other properties if needed
}

interface GoogleFontsResponse {
  items: GoogleFont[];
}
const FontSelector = ({ value, onChange }:FontSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [fonts, setFonts] = useState<string[]>([]);

  useEffect(() => {
    // Fetch fonts from Google Fonts API
    fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCG9LNdH6W6bOyR-lCDvM73wPNVpVkk0Tw')
      .then(response => response.json())
      .then((data: GoogleFontsResponse) => {
        setFonts(data.items.map((item: GoogleFont) => item.family));
      });

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Load all fonts when the component mounts
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css?family=${font.replace(' ', '+')}`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }, [fonts]);

  const filteredFonts = fonts.filter(font =>
    font.toLowerCase().includes(searchTerm.toLowerCase())
  );

// ... existing code ...

const handleFontSelect = (font: string) => {
  onChange(font);
  setIsOpen(false);
};

// ... rest of the code ...

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="font-selector">Font Family</Label>
      <div
        className="border rounded-md p-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: value }}
      >
        {value || 'Select a font'}
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <Input
            type="text"
            placeholder="Search font family..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2"
          />
          <ScrollArea className="h-60">
            {filteredFonts.map((font) => (
              <div
                key={font}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                style={{ fontFamily: font }}
                onClick={() => handleFontSelect(font)}
              >
                {font}
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
interface TextItem {
  id: number;
  text: string;
  fontFamily: string;
  textColor: string;
  gradientColor1: string;
  gradientColor2: string;
  useGradient: boolean;
  xPosition: number;
  yPosition: number;
  textSize: number;
  fontWeight: number;
  textOpacity: number;
  isReversed: boolean;
  rotation: number;
  isForeground: boolean;
}

type HistoryEntry = TextItem[];

const ImageEditorPage = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [items, setItems] = useState<TextItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [error, setError] = useState(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearAllDialog, setShowClearAllDialog] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [filter, setFilter] = useState({ name: 'none', value: 100 });
  const [applyFilterTo, setApplyFilterTo] = useState({ background: true, foreground: true });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not logged in, redirect to landing page
        router.push('/');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const extractColors = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get 2D context');
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      const colors: string[] = []; // Explicitly type the colors array
      const samplePoints = [
        [0, 0], [0.5, 0], [1, 0],
        [0, 0.5], [0.5, 0.5], [1, 0.5],
        [0, 1], [0.5, 1], [1, 1]
      ];
      
      samplePoints.forEach(([x, y]) => {
        const pixelData = ctx.getImageData(
          Math.floor(x * img.width),
          Math.floor(y * img.height),
          1, 1
        ).data;
        const color = `#${Array.from(pixelData.slice(0, 3)).map(x => x.toString(16).padStart(2, '0')).join('')}`;
        if (!colors.includes(color)) {
          colors.push(color);
        }
      });
      
      // Ensure we always have at least one color (white) and no more than 8
      colors.push('#ffffff');
      setDominantColors(colors.slice(0, 8));
    };
  };
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  // ... existing code ...

  const toggleFlipHorizontal = () => {
    setFlipHorizontal(!flipHorizontal);
  };

  const toggleFlipVertical = () => {
    setFlipVertical(!flipVertical);
  };
  const addNewItem = (width = 500, height = 500) => {
    const newItem: TextItem = {
      id: Date.now(),
      text: 'Sample Text',
      fontFamily: 'Inter',
      textColor: '#ffffff',
      gradientColor1: '#ffffff',
      gradientColor2: '#000000',
      useGradient: false,
      xPosition: Math.round(width / 3),
      yPosition: Math.round(height / 2),
      textSize: Math.round(Math.min(width, height) / 8),
      fontWeight: 400,
      textOpacity: 1,
      isReversed: false,
      rotation: 0,
      isForeground: false
    };
    setItems(prevItems => [...prevItems, newItem]);
    addToHistory([...items, newItem]);
  };
  const toggleForeground = (id: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, isForeground: !item.isForeground } : item
    );
    setItems(updatedItems);
    addToHistory(updatedItems);
  };
  const toggleGradient = (id: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, useGradient: !item.useGradient } : item
    );
    setItems(updatedItems);
    addToHistory(updatedItems);
  };

  const toggleReverse = (id: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, isReversed: !item.isReversed } : item
    );
    setItems(updatedItems);
    addToHistory(updatedItems);
  };

  const rotateText = (id: number, angle: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, rotation: (item.rotation + angle) % 360 } : item
    );
    setItems(updatedItems);
    addToHistory(updatedItems);
  };
  const updateItem = (id: number, field: keyof TextItem, value: TextItem[keyof TextItem]) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
    addToHistory(updatedItems);
  };

  const deleteItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    addToHistory(updatedItems);
  };

  const duplicateItem = (id: number) => {
    const itemToDuplicate = items.find(item => item.id === id);
    if (itemToDuplicate) {
      const newItem = { ...itemToDuplicate, id: Date.now() };
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      addToHistory(updatedItems);
    }
  };

  const addToHistory = (newItems: TextItem[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newItems);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setItems(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setItems(history[historyIndex + 1]);
    }
  };

 // ... existing code ...

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const file = e.target.files[0];
  if (!file) return;

  setIsLoading(true);
  setError(null);

  try {
    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        setOriginalImage(event.target.result as string);
        const img = new Image();
        img.onload = () => {
          setImageWidth(img.width);
          setImageHeight(img.height);
          setIsLoading(false);
          addNewItem(img.width, img.height);
          if (event.target && event.target.result) {
            extractColors(event.target.result as string);
          }
        };
        img.src = event.target.result as string;

        // Start background removal process
        setIsRemovingBackground(true);
        try {
          const blob = await fetch(event.target.result as string).then(res => res.blob());
          const removedBackground = await removeBackground(blob);
          const url = URL.createObjectURL(removedBackground);
          setProcessedImage(url);
        } catch (err) {
          console.error('Error removing background:', err);
         // setError('Failed to remove background. Original image will be used.');
        } finally {
          setIsRemovingBackground(false);
        }
      }
    };
    reader.readAsDataURL(file);
  } catch (err) {
    console.error('Error processing image:', err);
    //setError('Failed to process image. Please try again.');
    setIsLoading(false);
  }
};

// ... rest of the code ...

const captureAndSaveImage = () => {
  const canvas = canvasRef.current;
  if (canvas) {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = dataUrl;
    link.click();
  } else {
    console.error('Canvas is not available');
    // Optionally, you can show an error message to the user here
  }
};

  const clearAllItems = () => {
    setShowClearAllDialog(true);
  };

  const confirmClearAllItems = () => {
    setItems([]);
    addToHistory([]);
    setShowClearAllDialog(false);
  };

  const removeImage = () => {
    setShowDeleteDialog(true);
    
  };

  const confirmRemoveImage = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setItems([]);
    setImageWidth(0);
    setImageHeight(0);
    setZoom(1);
    setHistory([]);
    setHistoryIndex(-1);
    setFilter({ name: 'none', value: 100 });
    setApplyFilterTo({ background: true, foreground: true });
    setShowDeleteDialog(false);
    if(isFilterOpen){
      toggleFilterSection();
    }
  };

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.1));
  };

  const applyFilter = (ctx: CanvasRenderingContext2D, filterName: string, filterValue: number) => {
    switch (filterName) {
      case 'brightness':
        ctx.filter = `brightness(${filterValue}%)`;
        break;
      case 'contrast':
        ctx.filter = `contrast(${filterValue}%)`;
        break;
      case 'grayscale':
        ctx.filter = `grayscale(${filterValue}%)`;
        break;
      case 'sepia':
        ctx.filter = `sepia(${filterValue}%)`;
        break;
      case 'blur':
        ctx.filter = `blur(${filterValue / 10}px)`;
        break;
      default:
        ctx.filter = 'none';
    }
  };

  const toggleFilterSection = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const drawText = useCallback((ctx: CanvasRenderingContext2D, isForeground: boolean) => {
    items.forEach(item => {
      if (item.isForeground === isForeground) {
        ctx.save();
        ctx.font = `${item.fontWeight} ${item.textSize * zoom}px "${item.fontFamily}"`;
        ctx.globalAlpha = item.textOpacity;
        
        // Apply rotation
        ctx.translate(item.xPosition * zoom, item.yPosition * zoom);
        ctx.rotate(item.rotation * Math.PI / 180);
        
        // Apply reverse if needed
        if (item.isReversed) {
          ctx.scale(-1, 1);
        }
        
        if (item.useGradient) {
          const gradient = ctx.createLinearGradient(0, 0, ctx.measureText(item.text).width, 0);
          gradient.addColorStop(0, item.gradientColor1);
          gradient.addColorStop(1, item.gradientColor2);
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = item.textColor;
        }
        
        ctx.fillText(item.text, 0, 0);
        ctx.restore();
      }
    });
  }, [items,zoom]);
  useEffect(() => {
    if (originalImage) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width * zoom;
        canvas.height = img.height * zoom;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply flips
        ctx.save();
        ctx.translate(flipHorizontal ? canvas.width : 0, flipVertical ? canvas.height : 0);
        ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
        
        // Draw original image with filter if applicable
        if (applyFilterTo.background) {
          applyFilter(ctx, filter.name, filter.value);
        } else {
          ctx.filter = 'none';
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw background text items
        drawText(ctx, false);

        // Draw processed image on top if available
        if (processedImage) {
          const processedImg = new Image();
          processedImg.onload = () => {
            if (applyFilterTo.foreground) {
              applyFilter(ctx, filter.name, filter.value);
            } else {
              ctx.filter = 'none';
            }
            ctx.translate(flipHorizontal ? canvas.width : 0, flipVertical ? canvas.height : 0);
            ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
            ctx.drawImage(processedImg, 0, 0, canvas.width, canvas.height);
            
            // Draw foreground text items
            drawText(ctx, true);
          };
          processedImg.src = processedImage;
        } else {
          // Draw foreground text items if no processed image
          drawText(ctx, true);
        }
        
        ctx.restore();
      };
      img.src = originalImage;
    }
  }, [originalImage, processedImage, items, zoom, filter, applyFilterTo, flipHorizontal, flipVertical,drawText]);

  
  // Helper function to draw text
  

  return (
    <div className="flex flex-col h-screen">
      {/* App Bar */}
      <div className="bg-white text-white p-4 flex justify-between items-center">

        <h1 className="text-xl font-bold text-black">Text Inside Image</h1>
 
        {originalImage ? (
          <div className="flex items-center space-x-2">
                 
                   <Button 
                   className="bg-white text-black font-semibold rounded-lg px-4 py-2 shadow hover:bg-black hover:text-white transition duration-200 border-2 border-black"
                   onClick={captureAndSaveImage}
                 >
                   <Download className="inline mr-2 h-4 w-4" />
                   Download Image
                 </Button>
                 <a href="https://www.buymeacoffee.com/vyshnav.tr" target="_blank" rel="noopener noreferrer">
                 <img 
                   src="/images/default-yellow.png" 
                   alt="Buy Me A Coffee" 
                   style={{ height: '40px', width: 'auto' }}
                 />
               </a>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
          
          <Button 
          className="bg-white text-black font-semibold rounded-lg px-4 py-2 shadow hover:bg-black hover:text-white transition duration-200 border-black" 
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="inline mr-2 h-4 w-4" />
          Upload Image
        </Button>
        <a href="https://www.buymeacoffee.com/vyshnav.tr" target="_blank" rel="noopener noreferrer">
                 <img 
                   src="/images/default-yellow.png" 
                   alt="Buy Me A Coffee" 
                   style={{ height: '40px', width: 'auto' }}
                 />
               </a>
        </div>
        )}
      </div>
      <Separator />
      <div className="flex flex-1 overflow-hidden">
       {/* Left Sidebar with Icons - Only visible when an image is chosen */}
       {originalImage && (
          <div className="w-16 bg-white text-black flex flex-col items-center py-4 space-y-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFilterSection}
              className={`p-2 rounded-full ${isFilterOpen ? 'bg-black text-white' : ''}`}
            >
              <Sliders className="h-6 w-6" />
            </Button>
            {/* Add more icons here as needed */}
          </div>
        )}

         {/* Filter Section with animation */}
         <div 
          className={`bg-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            isFilterOpen ? 'w-64' : 'w-0'
          }`}
        >
          <div className="w-64 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Image Filters</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter-select">Filter Type</Label>
                <Select
                  value={filter.name}
                  onValueChange={(value) => setFilter({ ...filter, name: value })}
                >
                  <SelectTrigger id="filter-select">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="brightness">Brightness</SelectItem>
                    <SelectItem value="contrast">Contrast</SelectItem>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                    <SelectItem value="sepia">Sepia</SelectItem>
                    <SelectItem value="blur">Blur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {filter.name !== 'none' && (
                <div className="space-y-2">
                  <Label>Filter Intensity</Label>
                  <Slider
                    value={[filter.value]}
                    onValueChange={([value]) => setFilter({ ...filter, value })}
                    min={0}
                    max={200}
                    step={1}
                  />
                  <span>{filter.value}%</span>
                </div>
              )}
               <div className="space-y-2">
                <Label>Apply Filter To</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                  <Checkbox
  id="background"
  checked={applyFilterTo.background}
  onCheckedChange={(checked) => 
    setApplyFilterTo({ ...applyFilterTo, background: checked === true })
                    }
                    />
                    <label htmlFor="background">Background</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="foreground"
                      checked={applyFilterTo.foreground}
                      onCheckedChange={(checked) => 
                        setApplyFilterTo({ ...applyFilterTo, foreground: checked === true })
                      }
                    />
                    <label htmlFor="foreground">Foreground</label>
                  </div>
                  
                </div>
                <div className="space-y-2">
              <Label>Flip Image</Label>
              <Button
                  variant={flipHorizontal ? "default" : "outline"}
                  size="sm"
                  onClick={toggleFlipHorizontal}
                  className="flex items-center"
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Horizontal
                </Button>
                <Button
                  variant={flipVertical ? "default" : "outline"}
                  size="sm"
                  onClick={toggleFlipVertical}
                  className="flex items-center"
                >
                  <RotateCw className="h-4 w-4 mr-2 rotate-90" />
                  Vertical
                </Button>
                
              </div>
              <br />
              <br />
             
              </div>
            </div>
          </div>
        </div>
        {/* Main Content - Image Display */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="relative mb-4 h-[calc(100vh-8rem)] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            {originalImage ? (
              <>
                <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                <div className="absolute top-2 right-2 flex space-x-2">
                <Button 
                    className="bg-white text-black rounded-full p-2 hover:bg-gray-100 transition duration-200"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                  >
                    <Undo className="h-5 w-5" />
                  </Button>
                  <Button 
                    className="bg-white text-black rounded-full p-2 hover:bg-gray-100 transition duration-200"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <Redo className="h-5 w-5" />
                  </Button>
                  <Button 
                    className="bg-white text-black rounded-full p-2 hover:bg-blue-100 transition duration-200"
                    onClick={handleZoomIn}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                  <Button 
                    className="bg-white text-black rounded-full p-2 hover:bg-blue-100 transition duration-200"
                    onClick={handleZoomOut}
                  >
                    <ZoomOut className="h-5 w-5" />
                  </Button>
                 
                  <Button 
                    className="bg-white text-black rounded-full p-2 hover:bg-red-100 transition duration-200"
                    onClick={removeImage}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No image selected</h3>
                <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                <Button 
                  className="mt-2" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            )}
            {(isLoading || isRemovingBackground) && (
              <div className="absolute inset-0  flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                <span className="ml-2 text-white">
                  {isRemovingBackground ? '“Hold on, smart algorithms at work!”' : 'Loading...'}
                </span>
              </div>
            )}
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
        </div>

        {/* Right Sidebar - Text Controls */}
        {originalImage && (
          <div className="w-1/4 p-4 overflow-y-auto bg-gray-100">
            <div className="flex items-center justify-between mb-4">
            <Button onClick={() => addNewItem()} className="flex items-center w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Text
            </Button>
              <Button 
                onClick={clearAllItems} 
                className="ml-2 p-2 text-red-500 hover:bg-red-100 rounded bg-white"
                title="Clear All Text Items"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => (
                <AccordionItem key={item.id} value={`item-${item.id}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full p-1">
                      <span>{index + 1} - {item.text}</span>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateItem(item.id);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 p-5">
                      <div className="space-y-2">
                        <Label htmlFor={`text-${item.id}`}>Text</Label>
                        <Input
                          id={`text-${item.id}`}
                          value={item.text}
                          onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                          placeholder="Enter text"
                        />
                        <div className="flex items-center justify-between">
                <Label htmlFor={`foreground-${item.id}`}>Render in Foreground</Label>
                <Switch
                  id={`foreground-${item.id}`}
                  checked={item.isForeground}
                  onCheckedChange={() => toggleForeground(item.id)}
                />
              </div>
                      </div>
                      <FontSelector
          value={item.fontFamily}
          onChange={(font) => updateItem(item.id, 'fontFamily', font)}
        />
                      <div className="space-y-2">
          <Label htmlFor={`color-${item.id}`}>Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              id={`color-${item.id}`}
              type="color"
              value={item.textColor}
              onChange={(e) => updateItem(item.id, 'textColor', e.target.value)}
              className="w-12 h-12 p-1"
            />
            <div className="w-5"> </div>
            <div className="flex flex-wrap gap-1">
              {dominantColors.map((color) => (
                <Button
                  key={color}
                  className="w-8 h-8 p-0 rounded-full border-2 border-black"
                  style={{ backgroundColor: color }}
                  onClick={() => updateItem(item.id, 'textColor', color)}
                >
                  {item.textColor === color && <CircleDot className="h-4 w-4 text-black border-white border-2" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
                
                <div className="flex items-center space-x-2">
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`use-gradient-${item.id}`}
                      checked={item.useGradient}
                      onCheckedChange={() => toggleGradient(item.id)}
                    />
                    <Label htmlFor={`use-gradient-${item.id}`}>Use Gradient</Label>
                  </div>
                </div>
              </div>
              
              {item.useGradient && (
                <div className="space-y-2">
                  <Label>Gradient Colors</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={item.gradientColor1}
                      onChange={(e) => updateItem(item.id, 'gradientColor1', e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                    <Droplet className="h-4 w-4" />
                    <Input
                      type="color"
                      value={item.gradientColor2}
                      onChange={(e) => updateItem(item.id, 'gradientColor2', e.target.value)}
                      className="w-12 h-12 p-1"
                    />
                  </div>
                </div>
              )}
                      <div className="space-y-2">
                        <Label>X Position</Label>
                        <Slider
                          value={[item.xPosition]}
                          onValueChange={([value]) => updateItem(item.id, 'xPosition', value)}
                          min={0}
                          max={imageWidth}
                          step={1}
                        />
                        <span>{item.xPosition}px</span>
                      </div>
                      <div className="space-y-2">
                        <Label>Y Position</Label>
                        <Slider
                          value={[item.yPosition]}
                          onValueChange={([value]) => updateItem(item.id, 'yPosition', value)}
                          min={0}
                          max={imageHeight}
                          step={1}
                        />
                        <span>{item.yPosition}px</span>
                      </div>
                      <div className="space-y-2">
                        <Label>Text Size</Label>
                        <Slider
                          value={[item.textSize]}
                          onValueChange={([value]) => updateItem(item.id, 'textSize', value)}
                          min={10}
                          max={1000}
                          step={1}
                        />
                        <span>{item.textSize}px</span>
                      </div>
                      <div className="space-y-2">
                        <Label>Font Weight</Label>
                        <Slider
                          value={[item.fontWeight]}
                          onValueChange={([value]) => updateItem(item.id, 'fontWeight', Math.round(value / 100) * 100)}
                          min={100}
                          max={900}
                          step={100}
                        />
                        <span>{item.fontWeight}</span>
                      </div>
                      <div className="space-y-2">
                        <Label>Opacity</Label>
                        <Slider
                          value={[item.textOpacity]}
                          onValueChange={([value]) => updateItem(item.id, 'textOpacity', value)}
                          min={0}
                          max={1}
                          step={0.1}
                        />
                        <span>{(item.textOpacity * 100).toFixed(0)}%</span>
                      </div>
                      <div className="space-y-2">
                <Label>Text Rotation</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => rotateText(item.id, -90)}
                  >
                    <RotateCw className="h-4 w-4 rotate-[-90deg]" />
                  </Button>
                  <Slider
                    value={[item.rotation]}
                    onValueChange={([value]) => rotateText(item.id, value - item.rotation)}
                    min={0}
                    max={360}
                    step={1}
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => rotateText(item.id, 90)}
                  >
                    <RotateCw className="h-4 w-4 rotate-90" />
                  </Button>
                </div>
                <span>{item.rotation}°</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`reverse-${item.id}`}
                  checked={item.isReversed}
                  onCheckedChange={() => toggleReverse(item.id)}
                />
                <Label htmlFor={`reverse-${item.id}`}>Reverse Text</Label>
              </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>

      {/* Delete Image Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image and all associated text items.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveImage}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Items Confirmation Dialog */}
      <AlertDialog open={showClearAllDialog} onOpenChange={setShowClearAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to clear all text items?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove all text items from the image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAllItems}>Clear All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageEditorPage;