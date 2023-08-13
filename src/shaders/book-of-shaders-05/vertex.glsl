#include <common>
#include <skinning_pars_vertex>

void main() {
	#include <skinbase_vertex>
	#include <begin_vertex>
	#include <beginnormal_vertex>
	#include <defaultnormal_vertex>
	#include <skinning_vertex>
	#include <project_vertex>

	// gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mvPosition;
}