import React, { useState, useCallback } from 'react';
import { generateImageFromPrompt } from './services/geminiService';
import { AspectRatio, aspectRatios } from './types';
import Spinner from './components/Spinner';
import { SparklesIcon, ImageIcon, DownloadIcon } from './components/Icon';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Por favor, insira um prompt para gerar a imagem.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImageFromPrompt(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    const fileName = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 50) || 'generated-image';
    
    link.download = `${fileName}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, prompt]);


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 selection:bg-brand-primary/30">
      <main className="w-full max-w-6xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-8 h-8 text-brand-light"/>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
              Gerador de Imagens IA
            </h1>
          </div>
          <p className="text-gray-400 mt-2">
            Descreva a imagem que você deseja criar. Seja criativo e detalhado para melhores resultados.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row">
          {/* Controls Section */}
          <div className="w-full lg:w-1/3 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-gray-700">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Seu Prompt
              </label>
              <textarea
                id="prompt"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: um astronauta surfando em uma onda cósmica, estilo synthwave..."
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-brand-light focus:border-brand-light transition duration-200 resize-none"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">
                Proporção da Imagem
              </label>
              <select
                id="aspectRatio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-brand-light focus:border-brand-light transition duration-200 appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                disabled={isLoading}
              >
                {aspectRatios.map(ratio => (
                  <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={isLoading || !prompt.trim()}
              className="w-full flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 mr-3" />
                  Gerando...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Gerar Imagem
                </>
              )}
            </button>
          </div>

          {/* Image Display Section */}
          <div className="w-full lg:w-2/3 p-6 sm:p-8 flex flex-col items-center justify-center bg-black/20">
            <div className="w-full aspect-square max-w-lg bg-gray-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 overflow-hidden">
              {isLoading && (
                <div className="text-center text-gray-400">
                  <Spinner className="w-12 h-12 mx-auto text-brand-light" />
                  <p className="mt-4 font-semibold">Criando sua obra de arte...</p>
                  <p className="text-sm">Isso pode levar alguns segundos.</p>
                </div>
              )}
              {error && (
                <div className="text-center text-red-400 p-4">
                  <p className="font-bold">Oops! Algo deu errado.</p>
                  <p className="text-sm mt-2">{error}</p>
                </div>
              )}
              {!isLoading && !generatedImage && !error && (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto" />
                  <p className="mt-4 font-medium">Sua imagem aparecerá aqui</p>
                </div>
              )}
              {generatedImage && (
                <img 
                  src={generatedImage} 
                  alt={prompt} 
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {generatedImage && !isLoading && (
              <button
                onClick={handleDownload}
                className="w-full max-w-lg mt-4 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 active:scale-95"
                aria-label="Baixar a imagem gerada"
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Baixar Imagem
              </button>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center mt-6 text-gray-500 text-sm">
        <p>Desenvolvido com React, Tailwind CSS e Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;