const gui = new GUI();

gui.add( params, 'position', [ 'front', 'top' ] );
gui.add( params, 'lightMode', [ 'on', 'off' ] );
gui.add( params, 'autoRotate' );
gui.add( params, 'gemColor', [ 'Blue', 'Green', 'Red', 'White', 'Black', 'Lil Uzi Pink'] );
gui.add( params, 'gemCut', [ 'Talla Brillante', 'Talla Esmeralda', 'Talla Perruzi', 'Talla Heart','Lil Uzi Diamod'] );
gui.open();